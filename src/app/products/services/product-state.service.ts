import { Injectable } from '@angular/core';
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ProductState} from "./product-state";
import {ProductService} from "./product.service";
import {MessageService} from "primeng/api";
import {Product} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  stateSubject = new BehaviorSubject<ProductState>({
    products: [],
    filterCriteria: {},
    errorProducts: null,
    errorFilterCriteria: null,
    loadingProducts: false,
    loadingFilterCriteria: false
  })
  state$: Observable<ProductState> = this.stateSubject.asObservable()

  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ) {
  }

  filterProducts(categoryId: number | null, search: string | null,
                 properties: Map<string, string>, page: number | null,
                 itemsPerPage: number | null)
  {
    this.setLoadingProducts(true)
    this.productService.filterProducts(categoryId, search, properties, page, itemsPerPage).pipe(
      finalize(() => {

        this.setLoadingProducts(false)
      })
    )
      .subscribe({
        next: (products: Product[]) => {
          if(products) this.setErrorProducts(null)

          this.setProducts(products)
          if(categoryId) this.getFilterCriteria(categoryId)
        },
        error: (error) => {
          if(error.toString() === "Error: Server-side error: There are no products matching your search and filter criteria." && categoryId)
            this.getFilterCriteria(categoryId)
          this.setErrorProducts(error)
        }
      })
  }

  getFilterCriteria(categoryId: number) {
    this.setLoadingFilterCriteria(true)
    this.productService.getFilterCriteria(categoryId).subscribe({
      next: (filterCriteria: { [key: string]: string[] }) => {
        if(filterCriteria) this.setErrorFilterCriteria(null)

        this.setFilterCriteria(filterCriteria)
      },
      error: (error) => {
        this.setErrorFilterCriteria(error)
      },
      complete: () => {
        this.setLoadingFilterCriteria(false)
      }
    })
  }

  // STATE SETTERS

  setProducts(products: Product[]) {
    this.setState({products})
  }

  setFilterCriteria(filterCriteria: { [key: string]: string[] }) {
    this.setState({filterCriteria})
  }

  setErrorProducts(errorProducts: string | null) {
    this.setState({errorProducts})
  }

  setLoadingProducts(loadingProducts: boolean) {
    this.setState({loadingProducts})
  }

  setErrorFilterCriteria(errorFilterCriteria: string | null) {
    this.setState({errorFilterCriteria})
  }

  setLoadingFilterCriteria(loadingFilterCriteria: boolean) {
    this.setState({loadingFilterCriteria})
  }

  setState(partialState: Partial<ProductState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
