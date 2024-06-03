import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderStateService} from "../services/order-state.service";
import {Order} from "../models/order.model";
import {Product} from "../../products/models/product.model";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html'
})
export class OrderPageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  orderId: number = -1

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected orderState: OrderStateService,
    private userState: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.params['id'];

    this.subscriptions.add(
      this.getOrder()
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private getOrder() {
    return this.orderState.getOrderById(this.orderId).subscribe({
      next: (order: Order) => {
        this.orderState.setOrder(order)
        this.orderState.setError(null)
      },
      error: (error) => {
        this.orderState.setError(error)
      },
      complete: () => {
        this.orderState.setLoading(false)
      }
    })
  }

  getProductsCost(order: Order): number {
    let total: number = 0;

    order!.orderDetails.forEach(od => total += od.product!.price * od.count)

    return total
  }

  getTotalCost(order: Order): number {
    return this.getProductsCost(order) + 10
  }

  navigateToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  navigateToHome() {
    this.router.navigate(["home"])
  }

  addToWishlist(product: Product) {
    this.userState.addToWishlist(product)
  }
}
