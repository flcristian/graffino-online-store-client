import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, Subject, Subscription} from "rxjs";
import {TelevisionsStateService} from "../services/televisions-state.service";
import {Television} from "../models/television.model";

@Component({
  selector: 'app-televisions-list',
  templateUrl: './televisions-list.component.html'
})
export class TelevisionsListComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription()
  diameters: string[] = []
  resolutions: string[] = []

  constructor(
    protected state: TelevisionsStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.getTelevisions()
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
        this.getDiameters(data.televisions)
        this.getResolutions(data.televisions)
      },
      error:(error)=>{
        this.state.setError(error)
      },
      complete:() => {
        this.state.setLoading(false)
      }
    })
  }

  private getTelevisions() {
    return this.state.getAllTelevisions().subscribe({
      next: (televisions: Television[]) => {
        this.state.setTelevision(televisions)
        this.state.setFilteredTelevision(televisions)
      },
      error: (error) => {
        this.state.setError(error)
      },
      complete: () => {
        this.state.setLoading(false)
      }
    })
  }

  private getDiameters(televisions: Television[]) {
    const uniqueDiameters = new Set<string>();

    for (const product of televisions) {
      uniqueDiameters.add(product.diameter);
    }

    this.diameters = Array.from(uniqueDiameters);
  }
  private getResolutions(television: Television[]) {
    const uniqueResolutions = new Set<string>();

    for (const product of television) {
      uniqueResolutions.add(product.resolution);
    }

    this.resolutions = Array.from(uniqueResolutions);
  }

  isNotOlderThanThreeDays(productDate: Date): boolean {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(productDate) >= threeDaysAgo;
  };
  navigateToProduct(id: number) {

  }

  clearFilters(){
    this.usingDiameter = false
    this.usingResolution = false
    this.usedDiameter = ""
    this.usedResolution = ""

    this.state.clearFilters()
  }

  // SORTING

  sortConditions: { key: keyof Television, condition?: (a: any, b: any) => number }[] = [
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

  usingDiameter = false
  usedDiameter = ""

  usingResolution = false
  usedResolution = ""

  filters = {
    byDiameter: (diameter: string) => ({ condition: (product: Television) => product.diameter === diameter, key: 'diameter' as keyof Television }),
    byResolution: (resolution: string) => ({ condition: (product: Television) => product.resolution === resolution, key: 'resolution' as keyof Television }),
  };

  filterDiameter(diameter: string): void {
    if(diameter === this.usedDiameter){
      this.usingDiameter = false;
      this.usedDiameter = "";
      this.filter();
      return;
    }

    this.usingDiameter = true;
    this.usedDiameter = diameter;

    this.filter()
  }
  filterResolution(resolution: string): void {
    if (resolution === this.usedResolution) {
      this.usingResolution = false;
      this.usedResolution = "";
      this.filter();
      return;
    }

    this.usingResolution = true;
    this.usedResolution = resolution;

    this.filter()
  }

  filter() {
    let usedFilters = []

    if (this.usingDiameter) {
      usedFilters.push(this.filters.byDiameter(this.usedDiameter))
    }

    if (this.usingResolution) {
      usedFilters.push(this.filters.byResolution(this.usedResolution))
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
}

