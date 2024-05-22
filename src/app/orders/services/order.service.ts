import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private server: string = "http://localhost:5005/api/v1/Orders";

  constructor(private http: HttpClient) { }

  getOrdersByCustomerId(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.server}/${customerId}`)
  }

  getCartByCustomerId(customerId: string): Observable<Order> {
    return this.http.get<Order>(`${this.server}/cart/${customerId}`)
  }

  createCart(customerId: string): Observable<Order> {
    return this.http.post<Order>(`${this.server}/create`, { customerId: customerId })
  }
}
