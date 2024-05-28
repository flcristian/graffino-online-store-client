import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-your-orders',
  templateUrl: './your-orders.component.html'
})
export class YourOrdersComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()

  constructor(
    protected state: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.state.getOrders()
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
