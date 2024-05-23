import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html'
})
export class PaymentSuccessfulComponent {
  constructor(
    private router: Router
  ) { }

  navigateToProducts() {
    this.router.navigate(["products"])
  }
}
