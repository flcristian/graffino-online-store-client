import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ClothingState} from "./clothing-state";
import {ProductService} from "./product.service";
import {Clothing} from "../models/clothing.model";

@Injectable({
  providedIn: 'root'
})
export class ClothingStateService {
  stateSubject = new BehaviorSubject<ClothingState>({
    clothing: [],
    filteredClothing: [],
    error: null,
    loading: false
  })
  state$: Observable<ClothingState> = this.stateSubject.asObservable()

  constructor(
    private service: ProductService
  ) { }

  getAllClothing() {
    this.setLoading(true)
    return this.service.getAllClothing()
  }

  clearFilters(){
    const currentState = this.stateSubject.getValue();

    this.setFilteredClothing(currentState.clothing.slice())
  }

  // FILTER - SORT - SEARCH

  filter(filters: { condition: (clothing: Clothing) => boolean, key: keyof Clothing }[]): void {

    const currentState = this.stateSubject.getValue();
    let filteredClothing = currentState.clothing.slice();

    filters.forEach(filter => {
      filteredClothing = filteredClothing.filter(filter.condition);
    });

    this.setFilteredClothing(filteredClothing);
  }

  sort(sort: { key: keyof Clothing, condition?: (a: any, b: any) => number }){
    const currentState = this.stateSubject.getValue();
    let filteredClothing = currentState.filteredClothing.slice();

    filteredClothing = filteredClothing.sort((a, b) => {
      if (sort.condition) {
        return sort.condition(a[sort.key], b[sort.key]);
      } else {
        const aValue = a[sort.key];
        const bValue = b[sort.key];
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      }
    });

    this.setFilteredClothing(filteredClothing);
  }

  search(searchText: string) {
    const currentState = this.stateSubject.getValue();
    const text = searchText.toLowerCase()
    const filteredClothing = currentState.filteredClothing.filter(clothing =>
      clothing.name.toLowerCase().includes(text) ||
      clothing.style.toLowerCase().includes(text) ||
      clothing.color.toLowerCase().includes(text)
    );

    this.setFilteredClothing(filteredClothing);
  }

  // STATE SETTERS

  setClothing(clothing: Clothing[]) {
    this.setState({clothing})
  }

  setFilteredClothing(filteredClothing: Clothing[]) {
    this.setState({filteredClothing})
  }

  setError(error: string | null) {
    this.setState({error})
  }

  setLoading(loading: boolean) {
    this.setState({loading})
  }

  setState(partialState: Partial<ClothingState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
