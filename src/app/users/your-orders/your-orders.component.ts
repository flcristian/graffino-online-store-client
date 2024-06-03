import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-your-orders',
  templateUrl: './your-orders.component.html'
})
export class YourOrdersComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()

  constructor(
    protected state: CurrentUserStateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.state.getOrders()
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  navigateToOrder(id: number) {
    this.router.navigate(['/order', id]);
  }
}
