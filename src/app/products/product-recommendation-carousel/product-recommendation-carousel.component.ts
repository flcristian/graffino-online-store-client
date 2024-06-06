import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Product} from "../models/product.model";
import {ProductService} from "../services/product.service";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {FilterProductsResponse} from "../models/filter-products-response.model";
import {ExchangeRateService} from "../../utlity/exchange-rate.service";

@Component({
  selector: 'app-product-recommendation-carousel',
  templateUrl: './product-recommendation-carousel.component.html'
})
export class ProductRecommendationCarouselComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  products: Product[] | null = null;
  @Input() delay: number | null = null;
  @Input() title: string = "Similar Products";
  @Input() currentProductId: number = -1;
  @Input() categoryId: number | null = null;
  @Input() sort: string | null = null;
  @Input() properties: Map<string, string> | null = null;
  currency: string = "EUR"
  exchangeRateRON: number = 5
  exchangeRateUSD: number = 1

  responsiveOptions: any[] | undefined;

  constructor(
    private router: Router,
    protected service: ProductService,
    private userState: CurrentUserStateService,
    private exchangeRate: ExchangeRateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.getProducts()
    )

    this.responsiveOptions = [
      {
        breakpoint: '1280px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '1024px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      }
    ];

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

  private getProducts() {
    return this.service.filterProducts(this.categoryId, null, this.properties, null, null, this.sort).subscribe({
      next: (response: FilterProductsResponse) => {
        if(this.currentProductId !== -1) {
          response.products.splice(response.products.findIndex(p => p.id == this.currentProductId), 1)
        }

        this.products = response.products;
      }
    })
  }

  addToCart(product: Product) {
    this.userState.addToCart(product)
  }

  addToWishlist(product: Product) {
    this.userState.addToWishlist(product)
  }

  navigateToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  getProductPrice(price: number) {
    if(this.currency === "RON") return price * this.exchangeRateRON
    if(this.currency === "USD") return price * this.exchangeRateUSD
    return price
  }
}
