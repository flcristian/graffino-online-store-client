import { Injectable } from '@angular/core';
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ProductState} from "./product-state";
import {ProductService} from "./product.service";
import {MessageService} from "primeng/api";
import {Product} from "../models/product.model";
import {Category} from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  stateSubject = new BehaviorSubject<ProductState>({
    categories: [],
    products: [],
    filterCriteria: {},
    errorCategories: null,
    errorProducts: null,
    errorFilterCriteria: null,
    loadingCategories: false,
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
                 itemsPerPage: number | null, sort: string | null)
  {
    this.setLoadingProducts(true)
    this.productService.filterProducts(categoryId, search, properties, page, itemsPerPage, sort).pipe(
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

  getAllCategories() {
    this.setLoadingCategoires(true)
    return this.productService.getAllCategories()
  }

  // STATE SETTERS

  setCategories(categories: Category[]) {
    this.setState({categories})
  }

  setProducts(products: Product[]) {
    this.setState({products})
  }

  setFilterCriteria(filterCriteria: { [key: string]: string[] }) {
    this.setState({filterCriteria})
  }

  setErrorCategories(errorCategories: string | null) {
    this.setState({errorCategories})
  }

  setErrorProducts(errorProducts: string | null) {
    this.setState({errorProducts})
  }

  setErrorFilterCriteria(errorFilterCriteria: string | null) {
    this.setState({errorFilterCriteria})
  }

  setLoadingCategoires(loadingCategories: boolean) {
    this.setState({loadingCategories})
  }

  setLoadingProducts(loadingProducts: boolean) {
    this.setState({loadingProducts})
  }

  setLoadingFilterCriteria(loadingFilterCriteria: boolean) {
    this.setState({loadingFilterCriteria})
  }


  setState(partialState: Partial<ProductState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
