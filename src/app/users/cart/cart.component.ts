import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Order} from "../../orders/models/order.model";
import {Router} from "@angular/router";
import {CurrentUserStateService} from "../services/current-user-state.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription()
  cart: Order | null = null

  constructor(
    private router: Router,
    protected state: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.state.state$.subscribe(data => {
        if(data.user == null) this.navigateToHome()
        this.cart = data.cart
        console.log(this.cart)
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  navigateToHome() {
    this.router.navigate(["home"])
  }

  updateProductCount() {
    this.state.setCart(this.cart)
  }

  getProductsCost(): number {
    let total: number = 0;

    this.cart!.orderDetails.forEach(od => total += od.product!.price * od.count)

    return total
  }

  getTotalCost(): number {
    return this.getProductsCost() + 10
  }

  removeFromCart(id: number) {
    this.state.removeFromCart(id)
  }
}
