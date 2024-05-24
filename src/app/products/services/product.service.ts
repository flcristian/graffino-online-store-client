import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/product.model";
import {Category} from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private server: string = "http://localhost:5005/api/v1/Products";

  constructor(private http: HttpClient) { }

  filterProducts(categoryId: number | null, search: string | null,
                 properties: Map<string, string>, page: number | null,
                 itemsPerPage: number | null): Observable<Product[]>
  {
    let params = new HttpParams();

    if (categoryId !== null) {
      params = params.set('categoryId', categoryId.toString());
    }

    if (search !== null) {
      params = params.set('search', search);
    }

    properties.forEach((value, key) => {
      params = params.set(key, value);
    });

    if (page !== null) {
      params = params.set('page', page.toString());
    }

    if (itemsPerPage !== null) {
      params = params.set('itemsPerPage', itemsPerPage.toString());
    }

    return this.http.get<Product[]>(`${this.server}/filter-products`, { params });
  }

  getFilterCriteria(categoryId: number): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>(`${this.server}/filter-criteria/${categoryId}`)
  }
}
