import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent {
  selected: number = 1

  constructor(
    private router: Router
  ) { }

  selectClothing() {
    this.selected = 1
    this.router.navigate(["products/clothing"])
  }

  selectTelevisions() {
    this.selected = 2
    this.router.navigate(["products/televisions"])
  }
}
