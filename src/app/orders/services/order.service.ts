import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Order} from "../models/order.model";
import {Observable} from "rxjs";
import {loadStripe, Stripe} from "@stripe/stripe-js";
import {CheckoutRequest} from "../models/checkout-request.model";
import {UpdateOrderRequest} from "../models/update-order-request.model";
import {Token} from "../../users/models/token.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private server: string = `${environment.apiUrl}/api/v1/Orders`;
  private checkoutServer: string = `${environment.apiUrl}/api/v1/Checkout`
  stripe: Stripe | null = null

  constructor(private http: HttpClient) { }

  private async initializeStripe() {
    this.stripe = await loadStripe('pk_test_51PJKj4RqnOYJkgzarSGG6XTIbPFHJfwcGgN2M4RWAnsPFTrwoOHFTPbeTmrb1DJodczhaUK3a42ni44Qm1DKjf8n00yZIAorfx');
  }

  getOrdersByCustomerId(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.server}/orders/${customerId}`)
  }

  async createCheckoutSession(request: CheckoutRequest) {
    await this.ensureStripeInitialized();
    this.http.post(`${this.checkoutServer}/create-checkout-session`, request).subscribe((session: any) => {
      if (this.stripe) {
        this.stripe.redirectToCheckout({ sessionId: session.id }).then((result: any) => {
          if (result.error) {
            console.error('Error during redirect to checkout:', result.error.message);
          }
        });
      }
    });
  }

  private async ensureStripeInitialized() {
    if (!this.stripe) {
      this.initializeStripe()
    }
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.server}/all-orders`)
  }

  updateOrder(request: UpdateOrderRequest, token: Token): Observable<Order> {
    return this.http.put<Order>(`${this.server}/update`, request, this.generateHeaders(token))
  }

  generateHeaders(token: Token): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({
        'Authorization': `${token.tokenType} ${token.accessToken}`
      })
    }
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.server}/order/${id}`)
  }
}
