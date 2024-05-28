import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Product} from "../models/product.model";
import {ProductService} from "../services/product.service";

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

  constructor(
    private router: Router,
    protected service: ProductService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.getProducts()
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private getProducts() {
    return this.service.filterProducts(this.categoryId, null, this.properties, null, null, this.sort).subscribe({
      next: (products: Product[]) => {
        if(this.currentProductId !== -1) {
          products.splice(products.findIndex(p => p.id == this.currentProductId), 1)
        }

        this.products = products;
      }
    })
  }
}
