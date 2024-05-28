import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ProductState} from "./product-state";
import {ProductsState} from "./products-state";
import {Product} from "../models/product.model";
import {ProductService} from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  stateSubject = new BehaviorSubject<ProductState>({
    product: null,
    error: null,
    loading: false
  })
  state$: Observable<ProductState> = this.stateSubject.asObservable()

  constructor(
    private productService: ProductService
  ) { }

  getProductById(id: number) {
    this.setLoading(true)
    return this.productService.getProductById(id)
  }

  setProduct(product: Product | null) {
    this.setState({product})
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
