import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
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
export class ProductService {
  private server: string = "http://localhost:5005/api/v1/Products";

  constructor(private http: HttpClient) { }

  filterProducts(categoryId: number | null, search: string | null,
                 properties: Map<string, string> | null, page: number | null,
                 itemsPerPage: number | null, sort: string | null): Observable<Product[]>
  {
    let params = new HttpParams();

    if (categoryId !== null) {
      params = params.set('categoryId', categoryId.toString());
    }

    if (search !== null) {
      params = params.set('search', search);
    }

    if(properties !== null) {
      properties.forEach((value, key) => {
        params = params.set(key, value);
      });
    }

    if (page !== null) {
      params = params.set('page', page.toString());
    }

    if (itemsPerPage !== null) {
      params = params.set('itemsPerPage', itemsPerPage.toString());
    }

    if(sort !== null) {
      params = params.set('sort', sort);
    }

    return this.http.get<Product[]>(`${this.server}/filter-products`, { params });
  }

  getFilterCriteria(categoryId: number): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>(`${this.server}/filter-criteria/${categoryId}`)
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.server}/all-categories`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.server}/product/${id}`)
  }

  createProduct(request: CreateProductRequest, token: Token): Observable<Product> {
    return this.http.post<Product>(`${this.server}/create-product`, request, this.generateHeaders(token))
  }

  createCategory(request: CreateCategoryRequest, token: Token): Observable<Category>  {
    return this.http.post<Category>(`${this.server}/create-category`, request, this.generateHeaders(token))
  }

  updateProduct(request: UpdateProductRequest, token: Token): Observable<Product>  {
    return this.http.put<Product>(`${this.server}/update-product`, request, this.generateHeaders(token))
  }

  updateCategory(request: UpdateCategoryRequest, token: Token): Observable<Category> {
    return this.http.put<Category>(`${this.server}/update-category`, request, this.generateHeaders(token))
  }

  deleteProduct(productId: number, token: Token): Observable<Product>  {
    return this.http.delete<Product>(`${this.server}/delete-product/${productId}`, this.generateHeaders(token))
  }

  deleteCategory(categoryId: number, token: Token): Observable<Category>  {
    return this.http.delete<Category>(`${this.server}/delete-category/${categoryId}`, this.generateHeaders(token))
  }

  generateHeaders(token: Token): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({
        'Authorization': `${token.tokenType} ${token.accessToken}`
      })
    }
  }
}
