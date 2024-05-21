import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ProductState} from "./product-state";
import {ProductService} from "./product.service";
import {Clothing} from "../models/clothing.model";
import {Television} from "../models/television.model";

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  stateSubject = new BehaviorSubject<ProductState>({
    clothing: [],
    televisions: [],
    error: null,
    loading: false
  })
  state$: Observable<ProductState> = this.stateSubject.asObservable()

  constructor(
    private service: ProductService
  ) { }

  getAllClothing() {
    this.setLoading(true)
    return this.service.getAllClothing()
  }

  getAllTelevisions() {
    this.setLoading(true)
    return this.service.getAllTelevisions()
  }

  // STATE SETTERS

  setClothing(clothing: Clothing[]) {
    this.setState({clothing})
  }

  setTelevisions(televisions: Television[]) {
    this.setState({televisions})
  }

  setError(error: string | null) {
    this.setState({error})
  }

  setLoading(loading: boolean) {
    this.setState({loading})
  }

  setState(partialState: Partial<ProductState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
