import { Injectable } from '@angular/core';
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {OrdersState} from "./orders-state";
import {OrderService} from "./order.service";
import {MessageService} from "primeng/api";
import {Order} from "../models/order.model";
import {Token} from "../../users/models/token.model";
import {UpdateOrderRequest} from "../models/update-order-request.model";

@Injectable({
  providedIn: 'root'
})
export class OrdersStateService {
  private stateSubject = new BehaviorSubject<OrdersState>({
    orders: [],
    error: null,
    loading: false
  })
  state$: Observable<OrdersState> = this.stateSubject.asObservable()

  constructor(
    private service: OrderService,
    private messageService: MessageService
  ) { }

  getAllOrders() {
    this.setLoading(true)
    return this.service.getAllOrders()
  }

  updateOrder(request: UpdateOrderRequest, token: Token) {
    this.setLoading(true);
    this.service.updateOrder(request, token).pipe(
      finalize(() => {
        this.setLoading(false);
      })
    ).subscribe({
      next: (order: Order) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: `Order ${order.id} successfully updated!`
        })
        this.setError(null);
        this.updateOrderInState(order);
      },
      error: (error) => {
        this.setError(error);
      }
    });
  }

  updateOrderInState(updatedOrder: Order) {
    const orders = this.stateSubject.value.orders.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    this.setOrders(orders);
  }

  setOrders(orders: Order[]) {
    this.setState({orders})
  }

  setError(error: string | null) {
    this.setState({error})
  }

  setLoading(loading: boolean) {
    this.setState({loading})
  }

  setState(partialState: Partial<OrdersState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
