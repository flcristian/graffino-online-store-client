import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Order} from "../models/order.model";
import {Observable} from "rxjs";
import {Token} from "../../users/models/token.model";
import {OrderDetail} from "../../order-details/models/order-detail.model";
import {CreateOrderDetailRequest} from "../../order-details/models/create-order-detail-request.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private server: string = "http://localhost:5005/api/v1/Orders";

  constructor(private http: HttpClient) { }

  getOrdersByCustomerId(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.server}/orders/${customerId}`)
  }

  getCartByCustomerId(customerId: string): Observable<Order> {
    return this.http.get<Order>(`${this.server}/cart/${customerId}`)
  }

  createCart(customerId: string, token: Token): Observable<Order> {
    const headers = new HttpHeaders({
      'Authorization': `${token.tokenType} ${token.accessToken}`
    });

    return this.http.post<Order>(`${this.server}/create-cart`, { customerId: customerId }, { headers: headers })
  }

  addToCart(request: CreateOrderDetailRequest, token: Token): Observable<OrderDetail> {
    const headers = new HttpHeaders({
      'Authorization': `${token.tokenType} ${token.accessToken}`
    })

    return this.http.post<OrderDetail>(`${this.server}/create`, request, { headers: headers })
  }
}
