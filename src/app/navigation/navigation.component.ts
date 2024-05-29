import {Component, OnDestroy, OnInit} from '@angular/core';
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
        this.cart = data.cart
        this.wishlist = data.wishlist
      })
    )

    let token: Token = {
      tokenType: "Bearer",
      accessToken: "CfDJ8DswkO2bWyNHhZsQUZkwQnJSOBY33zr8yds8PBu64XnGBzqEjyb-lLF1e_jOAlEefWq6ytcVecC40nf4RDp5qSBdBF7S_IouUBdRv76kqarb7Cz2F8tTsIwkAPojUTmdZZVxJgQiqyh0L6bJZXDAIjuZkUOWvTO4Lc0pYoLH4Hy296lPe9eg5XbXItYTObME_yysW12EUw4C8og-akBThfISschb3gqcQm2BR_Y2g9AhkYpDVYU8T4xHK_8XIkoJsYzNq27OJqzW0z_i3va-TqGGEaaw-q9zp1XEOlRrWJbNqdZHXN10EBYSO4W-4FkBuUgJO1Q6kp5LJCEaNHH7SRLVh6ffnsvjKr3zCVCbtEEgIo_fu-Wkg3Gli7gLJ2UBs84tJZDK-8KZf6xYniQWpRD3Fc6ga3Uknd0hKkRKeinAEbu6xqqQJbeoCmBPeb2A1PvRzbSi_ymCh_-LouvNnDfH2BCVXCYYkMsSAlwkHKrW1bUJITvmQUB3D3_lTMZc9kP1aS0nH_rI8oJWzWVr5AQz7At3USKcgN8uZvi6ML1godvZ_GJVOWGufy_TbqfzpuUe32crEgu2GNQ3R3IZlr-2JCCylfsWYW6RCNrruXIsq7yQEPO3nz5Y3oeLw0GRW7yQ2-wxZdkF9d8r54n_tNrh8ku29z1ie4hAg80Ajpj9XixB4-chLYXndN4NvNul22wnDAaxPxbXdfSxMhp-OXaPEyPKAbFEY1aIxgCl0Msnp4eQYZEEgqnpNorbj7kTQzfBH2411YWMWgW-18MOWO1u72VObZLVug3FkRaz4SNGaJ9Q7nWxln4DvZ11aKucBaDWIZuJ911cLa77UIZAlWs"
    }

    let user: User = {
      id: "614176e5-98c8-473a-986e-e87515b2291a",
      email: "qflorescucristian@gmail.com",
      emailConfirmed: true,
      roles: ["Administrator"]
    }
    let cart: Order = {
      id: 0,
      customer: user,
      customerId: user.id,
      status: 0,
      lastDateUpdated: new Date(),
      orderDetails: []
    }
    let wishlist: Order = {
      id: 0,
      customer: user,
      customerId: user.id,
      status: 0,
      lastDateUpdated: new Date(),
      orderDetails: []
    }
    this.state.setToken(token)
    this.state.setUser(user)
    this.state.setCart(cart)
    this.state.setWishlist(wishlist)
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
