import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, Subscription} from "rxjs";
import {CurrentUserStateService} from "../users/services/current-user-state.service";
import {LoginRequest} from "../users/models/login-request.model";
import {User} from "../users/models/user.model";
import {Order} from "../orders/models/order.model";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription()
  selected: number = -1
  user: User | null = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected state: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.getCurrentPage()
    )

    this.subscriptions.add(
      this.state.state$.subscribe(data => {
        this.user = data.user
      })
    )

    let user: User = {
      id: "bd1ddba4-e622-4c5b-9930-73c31c636424",
      email: "qflorescucristian@gmail.com",
      emailConfirmed: true,
      roles: []
    }
    this.state.setUser(user)

    this.state.getCart();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  getCurrentPage(){
    return this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.selected = -1;
        if (url === '/home') {
          this.selected = 1;
        }
        if (url === '/products') {
          this.selected = 2;
        }
        if (url === '/contact') {
          this.selected = 3;
        }
      });
  }

  navigateToHome() {
    this.router.navigate(["home"])
  }

  navigateToProducts() {
    this.router.navigate(["products"])
  }

  navigateToContact() {
    this.router.navigate(["contact"])
  }

  navigateToCart(){
    this.router.navigate(["cart"])
  }

  navigateToLogin() {
    this.router.navigate(["login"])
  }

  navigateToAccount() {
    this.router.navigate(["account"])
  }
}
