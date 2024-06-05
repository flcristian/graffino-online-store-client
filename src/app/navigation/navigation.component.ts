import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter, Subscription} from "rxjs";
import {CurrentUserStateService} from "../users/services/current-user-state.service";
import {LoginRequest} from "../users/models/login-request.model";
import {User} from "../users/models/user.model";
import {Order} from "../orders/models/order.model";
import {Token} from "../users/models/token.model";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription()
  selected: number = -1
  user: User | null = null
  cart: Order | null = null
  wishlist: Order | null = null
  isSticky: boolean = false;
  startEffect: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected state: CurrentUserStateService
  ) { }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.startEffect = scrollPosition >= 250
    this.isSticky = scrollPosition >= 300;
  }

  ngOnInit() {
    this.subscriptions.add(
      this.getCurrentPage()
    )

    this.subscriptions.add(
      this.state.state$.subscribe(data => {
        this.user = data.user
        this.cart = data.cart
        this.wishlist = data.wishlist
      })
    )
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

  navigateToCart(){
    this.router.navigate(["cart"])
  }

  navigateToLogin() {
    this.router.navigate(["login"])
  }

  navigateToAccount() {
    this.router.navigate(["account"])
  }

  navigateToWishlist() {
    this.router.navigate(["wishlist"])
  }

  navigateToAdmin() {
    this.router.navigate(["admin"])
  }
}
