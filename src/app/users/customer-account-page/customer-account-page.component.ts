import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Subscription} from "rxjs";
import {User} from "../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customer-account-page',
  templateUrl: './customer-account-page.component.html'
})
export class CustomerAccountPageComponent implements OnInit, OnDestroy{
  subscriptions = new Subscription()
  user: User | null = null

  constructor(
    private router: Router,
    protected state: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.state.state$.subscribe(data => this.user = data.user)
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  selectYourOrders() {
    this.router.navigate(["account/your-orders"])
  }

  selectChangePassword() {
    this.router.navigate(["account/change-password"])
  }
}
