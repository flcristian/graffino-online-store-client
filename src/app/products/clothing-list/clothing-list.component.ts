import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, Subject, Subscription} from "rxjs";
import {ClothingStateService} from "../services/clothing-state.service";
import {Clothing} from "../models/clothing.model";
import {ColorMap} from "../../utlity/color-map"

@Component({
  selector: 'app-clothing-list',
  templateUrl: './clothing-list.component.html'
})
export class ClothingListComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription()
  colors: string[] = []
  styles: string[] = []
  sizes: string[] = []
  colorblind: boolean = true;
  colorMap = ColorMap

  constructor(
    protected state: ClothingStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.getClothing()
    )

    this.subscriptions.add(
      this.getFilteredProductsData()
    )

    this.subscriptions.add(
      this.searchTextChange.pipe(
        debounceTime(250)
      ).subscribe(() => {this.search()})
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private getFilteredProductsData(): Subscription{
    this.state.setLoading(true)
    return this.state.state$.subscribe({
      next:(data)=>{
        this.getColors(data.clothing)
        this.getStyles(data.clothing)
        this.getSizes(data.clothing)
      },
      error:(error)=>{
        this.state.setError(error)
      },
      complete:() => {
        this.state.setLoading(false)
      }
    })
  }

  private getClothing() {
    return this.state.getAllClothing().subscribe({
      next: (clothing: Clothing[]) => {
        this.state.setClothing(clothing)
        this.state.setFilteredClothing(clothing)
      },
      error: (error) => {
        this.state.setError(error)
      },
      complete: () => {
        this.state.setLoading(false)
      }
    })
  }

  private getColors(clothing: Clothing[]) {
    const uniqueColors = new Set<string>();

    for (const product of clothing) {
      uniqueColors.add(product.color);
    }

    this.colors = Array.from(uniqueColors);
  }
  private getStyles(clothing: Clothing[]) {
    const uniqueStyles = new Set<string>();

    for (const product of clothing) {
      uniqueStyles.add(product.style);
    }

    this.styles = Array.from(uniqueStyles);
  }
  private getSizes(clothing: Clothing[]) {
    const uniqueSizes = new Set<string>();

    for (const product of clothing) {
      uniqueSizes.add(product.size);
    }

    this.sizes = Array.from(uniqueSizes);
  }

  isNotOlderThanThreeDays(productDate: Date): boolean {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(productDate) >= threeDaysAgo;
  };
  navigateToProduct(id: number) {

  }

  clearFilters(){
    this.usingColor = false
    this.usingStyle = false
    this.usingSize = false
    this.usedColor = ""
    this.usedStyle = ""
    this.usedSize = ""

    this.state.clearFilters()
  }

  // SORTING

  sortConditions: { key: keyof Clothing, condition?: (a: any, b: any) => number }[] = [
    { key: 'price', condition: (a, b) => a - b },
    { key: 'price', condition: (a, b) => b - a },
    { key: 'dateAdded', condition: (a, b) => new Date(a).getTime() - new Date(b).getTime() },
    { key: 'dateAdded', condition: (a, b) => new Date(b).getTime() - new Date(a).getTime() }
  ];

  sortByPriceAscending(){
    this.state.sort(this.sortConditions[0]);
  }
  sortByPriceDescending(){
    this.state.sort(this.sortConditions[1]);
  }
  sortByDateAddedAscending(){
    this.state.sort(this.sortConditions[2]);
  }
  sortByDateAddedDescending(){
    this.state.sort(this.sortConditions[3]);
  }

  // FILTERING

  usingColor = false
  usedColor = ""

  usingStyle = false
  usedStyle = ""

  usingSize = false
  usedSize = ""

  filters = {
    byColor: (color: string) => ({ condition: (product: Clothing) => product.color === color, key: 'color' as keyof Clothing }),
    byStyle: (style: string) => ({ condition: (product: Clothing) => product.style === style, key: 'category' as keyof Clothing }),
    bySize: (size: string) => ({ condition: (product: Clothing) => product.size === size, key: 'subcategory' as keyof Clothing })
  };

  filterColor(color: string): void {
    if(color === this.usedColor){
      this.usingColor = false;
      this.usedColor = "";
      this.filter();
      return;
    }

    this.usingColor = true;
    this.usedColor = color;

    this.filter()
  }
  filterStyle(style: string): void {
    if(style === this.usedStyle){
      this.usingStyle = false;
      this.usedStyle = "";
      this.filter();
      return;
    }

    this.usingStyle = true;
    this.usedStyle = style;

    this.filter()
  }
  filterSize(size: string): void {
    if(size === this.usedSize){
      this.usingSize = false;
      this.usedSize = "";
      this.filter();
      return;
    }

    this.usingSize = true;
    this.usedSize = size;

    this.filter()
  }

  filter() {
    let usedFilters = []

    if (this.usingColor) {
      usedFilters.push(this.filters.byColor(this.usedColor))
    }

    if (this.usingStyle) {
      usedFilters.push(this.filters.byStyle(this.usedStyle))
    }

    if (this.usingSize) {
      usedFilters.push(this.filters.bySize(this.usedSize))
    }

    this.state.filter(usedFilters);
  }

  // SEARCHING

  private searchTextChange = new Subject<string>();
  searchText: string = "";

  onSearchTextChange(){
    this.searchTextChange.next(this.searchText)
  }

  search(){
    this.filter()
    this.state.search(this.searchText);
  }

  protected readonly ColorMap = ColorMap;
}
