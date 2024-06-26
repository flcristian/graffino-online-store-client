import {Component, OnDestroy, OnInit} from '@angular/core';
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Subscription} from "rxjs";
import {User} from "../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html'
})
export class AccountPageComponent implements OnInit, OnDestroy{
  subscriptions = new Subscription()
  user: User | null = null

  constructor(
    private router: Router,
    protected state: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.state.state$.subscribe(data => {
        if(data.user == null) this.navigateToHome()
        this.user = data.user
      })
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

  selectSiteSettings() {
    this.router.navigate(["account/site-settings"])
  }

  navigateToHome() {
    this.router.navigate(["home"])
  }

  logout() {
    this.state.logout()
  }
}
