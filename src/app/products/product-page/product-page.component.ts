import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {Subscription} from "rxjs";
import {ProductStateService} from "../services/product-state.service";
import {Product} from "../models/product.model";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  productId: number = -1

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected productState: ProductStateService,
    protected userState: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.params['id'];

    this.subscriptions.add(
      this.getProduct()
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private getProduct() {
    return this.productState.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.productState.setProduct(product)
        this.productState.setError(null)
      },
      error: (error) => {
        this.productState.setError(error)
      },
      complete: () => {
        this.productState.setLoading(false)
      }
    })
  }

  addToCart(product: Product) {
    this.userState.addToCart(product)
  }

  navigateToProducts() {
    this.router.navigate(["products"])
  }

  protected readonly Number = Number;
}
