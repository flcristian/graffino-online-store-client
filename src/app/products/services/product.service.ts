import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/product.model";
import {Clothing} from "../models/clothing.model";
import {Television} from "../models/television.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private server: string = "http://localhost:5005/api/v1/Products";

  constructor(private http: HttpClient) { }

  getAllClothing(): Observable<Clothing[]> {
    return this.http.get<Clothing[]>(this.server + "/all-clothing")
  }

  getAllTelevisions(): Observable<Television[]> {
    return this.http.get<Television[]>(this.server + "/all-televisions")
  }

  getClothingById(id: number): Observable<Clothing> {
    return this.http.get<Clothing>(this.server + `/clothing/${id}`)
  }

  getTelevisionById(id: number): Observable<Television> {
    return this.http.get<Television>(this.server + `/television/${id}`)
  }
}
