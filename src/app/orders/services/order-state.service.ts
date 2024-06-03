import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {OrderState} from "./order-state";
import {Order} from "../models/order.model";
import {OrderService} from "./order.service";

@Injectable({
  providedIn: 'root'
})
export class OrderStateService {
  stateSubject = new BehaviorSubject<OrderState>({
    order: null,
    error: null,
    loading: false
  })
  state$: Observable<OrderState> = this.stateSubject.asObservable()

  constructor(
    private orderService: OrderService
  ) { }

  getOrderById(id: number) {
    this.setLoading(true)
    return this.orderService.getOrderById(id)
  }

  setOrder(order: Order | null) {
    this.setState({order})
  }

  setError(error: string | null) {
    this.setState({error})
  }

  setLoading(loading: boolean) {
    this.setState({loading})
  }

  setState(partialState: Partial<OrderState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
