import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private server: string = "http://localhost:5116/api/v1/Products";

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.server + "/all-products")
  }

  getProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(this.server + `/product/${productId}`)
  }
}
