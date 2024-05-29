import { Injectable } from '@angular/core';
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {ProductsState} from "./products-state";
import {ProductService} from "./product.service";
import {MessageService} from "primeng/api";
import {Product} from "../models/product.model";
import {Category} from "../models/category.model";
import {CreateProductRequest} from "../models/create-product-request.model";
import {CreateCategoryRequest} from "../models/create-category-request.model";
import {UpdateProductRequest} from "../models/update-product-request.model";
import {Token} from "../../users/models/token.model";
import {UpdateCategoryRequest} from "../models/update-category-request.model";

@Injectable({
  providedIn: 'root'
})
export class ProductsStateService {
  stateSubject = new BehaviorSubject<ProductsState>({
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
  state$: Observable<ProductsState> = this.stateSubject.asObservable()

  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  // SERVICE CALLS

  filterProducts(categoryId: number | null, search: string | null,
                 properties: Map<string, string> | null, page: number | null,
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
    this.setLoadingCategories(true)
    return this.productService.getAllCategories()
  }

  createProduct(request: CreateProductRequest, token: Token) {
    this.setLoadingProducts(true);
    this.productService.createProduct(request, token).pipe(
      finalize(() => {
        this.setLoadingProducts(false);
      })
    ).subscribe({
      next: (product: Product) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: `Product ${product.name} successfully created!`
        })
        this.setErrorProducts(null);
        this.addProduct(product);
      },
      error: (error) => {
        this.setErrorProducts(error);
      }
    });
  }

  createCategory(request: CreateCategoryRequest, token: Token) {
    this.setLoadingCategories(true);
    this.productService.createCategory(request, token).pipe(
      finalize(() => {
        this.setLoadingCategories(false);
      })
    ).subscribe({
      next: (category: Category) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: `Category ${category.name} successfully created!`
        })
        this.setErrorCategories(null);
        this.addCategory(category);
      },
      error: (error) => {
        this.setErrorCategories(error);
      }
    });
  }

  updateProduct(request: UpdateProductRequest, token: Token) {
    this.setLoadingProducts(true);
    this.productService.updateProduct(request, token).pipe(
      finalize(() => {
        this.setLoadingProducts(false);
      })
    ).subscribe({
      next: (product: Product) => {
        this.setErrorProducts(null);
        this.updateProductInState(product);
      },
      error: (error) => {
        this.setErrorProducts(error);
      }
    });
  }

  updateCategory(request: UpdateCategoryRequest, token: Token) {
    this.setLoadingCategories(true);
    this.productService.updateCategory(request, token).pipe(
      finalize(() => {
        this.setLoadingCategories(false);
      })
    ).subscribe({
      next: (category: Category) => {
        this.setErrorCategories(null);
        this.updateCategoryInState(category);
      },
      error: (error) => {
        this.setErrorCategories(error);
      }
    });
  }

  deleteProduct(productId: number, token: Token) {
    this.setLoadingProducts(true);
    this.productService.deleteProduct(productId, token).pipe(
      finalize(() => {
        this.setLoadingProducts(false);
      })
    ).subscribe({
      next: () => {
        this.setErrorProducts(null);
        this.removeProduct(productId);
      },
      error: (error) => {
        this.setErrorProducts(error);
      }
    });
  }

  deleteCategory(categoryId: number, token: Token) {
    this.setLoadingCategories(true);
    this.productService.deleteCategory(categoryId, token).pipe(
      finalize(() => {
        this.setLoadingCategories(false);
      })
    ).subscribe({
      next: () => {
        this.setErrorCategories(null);
        this.removeCategory(categoryId);
      },
      error: (error) => {
        this.setErrorCategories(error);
      }
    });
  }

  // STATE UPDATERS

  addCategory(category: Category) {
    this.setCategories([...this.stateSubject.value.categories, category]);
  }

  addProduct(product: Product) {
    this.setProducts([...this.stateSubject.value.products, product]);
  }

  updateProductInState(updatedProduct: Product) {
    const products = this.stateSubject.value.products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    this.setProducts(products);
  }

  updateCategoryInState(updatedCategory: Category) {
    const categorys = this.stateSubject.value.categories.map(category =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    this.setCategories(categorys);
  }

  removeProduct(productId: number) {
    const products = this.stateSubject.value.products.filter(product => product.id !== productId);
    this.setProducts(products);
  }

  removeCategory(categoryId: number) {
    const categories = this.stateSubject.value.categories.filter(category => category.id !== categoryId);
    this.setCategories(categories);
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

  setLoadingCategories(loadingCategories: boolean) {
    this.setState({loadingCategories})
  }

  setLoadingProducts(loadingProducts: boolean) {
    this.setState({loadingProducts})
  }

  setLoadingFilterCriteria(loadingFilterCriteria: boolean) {
    this.setState({loadingFilterCriteria})
  }


  setState(partialState: Partial<ProductsState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
