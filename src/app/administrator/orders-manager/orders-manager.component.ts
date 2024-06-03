import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {OrdersStateService} from "../../orders/services/orders-state.service";
import {Order} from "../../orders/models/order.model";
import {Token} from "../../users/models/token.model";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {UpdateOrderRequest} from "../../orders/models/update-order-request.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-orders-manager',
  templateUrl: './orders-manager.component.html'
})
export class OrdersManagerComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  token: Token | null = null;

  constructor(
    protected orderState: OrdersStateService,
    private userState: CurrentUserStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.getAllOrders()
    )

    this.token = this.userState.getToken()
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  getAllOrders() {
    return this.orderState.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.orderState.setOrders(orders)
      },
      error: (error) => {
        this.orderState.setError(error)
      },
      complete: () => {
        this.orderState.setLoading(false)
      }
    })
  }

  onRowEditSave(order: Order) {
    if(!this.token) {
      return
    }

    let request: UpdateOrderRequest = {
      id: order.id,
      status: Number(order.status)
    }

    this.orderState.updateOrder(request, this.token)
  }

  navigateToOrder(id: number) {
    this.router.navigate(['/order', id]);
  }
}
