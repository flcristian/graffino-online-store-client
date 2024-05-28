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
      accessToken: "CfDJ8KPlH2Bs_pFHrhdy1pG9SJk-KlwwYDUoVLk7defhbN8c_lNuSEgbu27_-m0MHxnuhVoAfiezfHjOoSqg-XBputFIAqLGYb4iV1y3eycU0W98ZvpOfUm6fMTG1xvT5gyK7dhxjZW3kT_5fDj0fZhpuKmR-uZ_x3hNXncdguojm2mO3CZKhH2MasNUaZ07tCBMNMjPn84f3ftvh1Qt2Lv6oy2wW7zet6CZDbqaMCNoySMNiTZv1NFpwv5zUz0lFlcZ_1t9xxP_UJuZ9p3Wtx_VvhhyWvRzWACu2U21e_nZtFRI6-xiY7xRrVWTJ-aeEfFh78todpfv3h6pGxCUriJ58WXkEQf5eZyJeNX29iJrtCkXZ75kjdEwkHYt2M1vJh5Afqw7v4JTX_H0Z14kdWB8CtS0ioK3mazOEiqdYnCEsRn5V-Q5PhzyhyDxy1qkfEdsm_n8gSwaIwlbSSd3qFcEaw6KH1snVQD5RKWfKWb7Fg5inyiiMM9WoHFIsDx4Koa22E_TkyiTVZvYcycACcfAwyJXV_mduldmLfWhtuzOpjH3JBjjytVpPzc43yXmZoD0-zDhV8ZIZGGKjx3Hufc85ZPhZ3YY9n46M0CWH_kVcdF_bC7LFkgGBQDDz6otjB_ly8aAw96XnhSHh5jXFRv0VR5r8ResBZRBClJTBDqJUY_tHh6Zx9dgeh5EuVk4Hit62LqBenrRVG16x2dgGHZ4Zwr1uji3WpY5eYkYR73i439SebxfEmF9LoQEzCp9w-uGhPMeEJ8ZQBJCkgK4656dzrcPQQ7ADihxujrfbZKEdJbItI8qtq0Qgl-k2XMB3rPdykhh7Wj_VDyidzu1kqJI6bI"
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
