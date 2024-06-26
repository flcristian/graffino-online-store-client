import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {Subscription} from "rxjs";
import {ProductStateService} from "../services/product-state.service";
import {Product} from "../models/product.model";
import {ExchangeRateService} from "../../utlity/exchange-rate.service";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  productId: number = -1
  currency: string = "EUR"
  exchangeRateRON: number = 5
  exchangeRateUSD: number = 1

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected productState: ProductStateService,
    protected userState: CurrentUserStateService,
    private exchangeRate: ExchangeRateService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id']
      this.subscriptions.add(
        this.getProduct()
      )
    })

    this.currency = this.userState.getCurrency()

    this.subscriptions.add(
      this.exchangeRate.getExchangeRate().subscribe(data => {
        this.exchangeRateRON = data.rates.RON
        this.exchangeRateUSD = data.rates.USD
      })
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

  addToWishlist(product: Product) {
    this.userState.addToWishlist(product)
  }

  getProductPrice(price: number) {
    if(this.currency === "RON") return price * this.exchangeRateRON
    if(this.currency === "USD") return price * this.exchangeRateUSD
    return price
  }
}
