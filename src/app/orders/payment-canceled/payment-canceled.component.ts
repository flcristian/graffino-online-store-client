import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-canceled',
  templateUrl: './payment-canceled.component.html'
})
export class PaymentCanceledComponent {

  constructor(
    private router: Router
  ) { }

  navigateToProducts() {
    this.router.navigate(["products"])
  }
}
