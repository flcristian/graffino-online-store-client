import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Order} from "../../orders/models/order.model";
import {Router} from "@angular/router";
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Product} from "../../products/models/product.model";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html'
})
export class WishlistComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription()
  wishlist: Order | null = null

  constructor(
    private router: Router,
    protected state: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.state.state$.subscribe(data => {
        if(data.user == null) this.navigateToHome()
        this.wishlist = data.wishlist
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  navigateToHome() {
    this.router.navigate(["home"])
  }

  removeFromWishlist(id: number) {
    this.state.removeFromWishlist(id)
  }

  navigateToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  addToCart(product: Product) {
    this.state.addToCart(product)
  }
}
