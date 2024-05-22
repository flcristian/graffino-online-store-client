import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {TelevisionsState} from "./televisions-state";
import {ProductService} from "./product.service";
import {Television} from "../models/television.model";

@Injectable({
  providedIn: 'root'
})
export class TelevisionsStateService {
  stateSubject = new BehaviorSubject<TelevisionsState>({
    televisions: [],
    filteredTelevisions: [],
    error: null,
    loading: false
  })
  state$: Observable<TelevisionsState> = this.stateSubject.asObservable()


  constructor(
    private service: ProductService
  ) { }

  getAllTelevisions() {
    this.setLoading(true)
    return this.service.getAllTelevisions()
  }

  clearFilters(){
    const currentState = this.stateSubject.getValue();

    this.setFilteredTelevision(currentState.televisions.slice())
  }

  // FILTER - SORT - SEARCH

  filter(filters: { condition: (television: Television) => boolean, key: keyof Television }[]): void {

    const currentState = this.stateSubject.getValue();
    let filteredTelevision = currentState.televisions.slice();

    filters.forEach(filter => {
      filteredTelevision = filteredTelevision.filter(filter.condition);
    });

    this.setFilteredTelevision(filteredTelevision);
  }

  sort(sort: { key: keyof Television, condition?: (a: any, b: any) => number }){
    const currentState = this.stateSubject.getValue();
    let filteredTelevisions = currentState.filteredTelevisions.slice();

    filteredTelevisions = filteredTelevisions.sort((a, b) => {
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

    this.setFilteredTelevision(filteredTelevisions);
  }

  search(searchText: string) {
    const currentState = this.stateSubject.getValue();
    const text = searchText.toLowerCase()
    const filteredTelevisions = currentState.filteredTelevisions.filter(television =>
      television.name.toLowerCase().includes(text) ||
      television.diameter.toLowerCase().includes(text) ||
      television.resolution.toLowerCase().includes(text)
    );

    this.setFilteredTelevision(filteredTelevisions);
  }

  // STATE SETTERS

  setTelevision(televisions: Television[]) {
    this.setState({televisions})
  }

  setFilteredTelevision(filteredTelevisions: Television[]) {
    this.setState({filteredTelevisions})
  }

  setError(error: string | null) {
    this.setState({error})
  }

  setLoading(loading: boolean) {
    this.setState({loading})
  }

  setState(partialState: Partial<TelevisionsState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
