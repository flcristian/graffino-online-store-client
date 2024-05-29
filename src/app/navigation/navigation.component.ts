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
      accessToken: "CfDJ8KPlH2Bs_pFHrhdy1pG9SJn6h3ZiOvEgUBG6eo9RsLIYFGgX5MlFoEysABcxLG2wEh8X65Bw896vwjEjW2f0CcjuMwKIApWBIYnRChbUvfV0Dz0EEtT-7n_clEJv-GDdb1Vja5nHQUMOcQ6Cvl7VOxgoa9E6YsnSqpqB7DfqQd9yOsK5wbo0B-_c_x8sBeQn6oT5aW-PHl6shUI7EcM7ggVMkAS2Mvr8EV6Cy2t0R-wqCwftBOkgMel9XOG22rwvvbAG9wUtL7QI3Cmkz2jT7jdU2I13zAr5KXfQcPt1a2b_fpOvk9J5cSnGxkjeigvlqsHY_aUlb2Y_SpQIccavRfGjnsUJvQFtorlg-VXRD8n56clBgcuxknvRHO3OXxPGaGjfR7HtrnV23ligPlkrynd9kP6yFixfwv87tEKsYLb-bSbVLag0bEKMx42H4k-teH5XZ7TvHQVFCjbhS_DzGWVsIK6IOFFd-NoncumCCm5jij4K7Y2ZWclQRgb8KfGvMHPqpHBtrkIhrTaHvUHJv8ZF3ODB1htRvZI73gqrwRLBuB7grpBU9yrQH8g2suM1Z8Aly7PWk9OixMDf2JStr66DhIlqEezVRUaU2llfC9yr04k0HjvI4Si6klD0a9YDd-nyf9Lz3pUaU89LjjUkvyTwro1Ah5saDRH1sMj9c3CfHEcCtqe_hF9dlrfZqsT-8falpAx0nzEVyLB3Xklw-8ZkIi02C8ukm1lKHLaSvpidF230Pp-oAizLwrwYnzBBx1bLL0SkXJT5XPKElNtNJZqTGvpDEAatdhRnKuh5kVFHzrkOfM4FBS0ikN6rp-lGd1__GDXtwwqTY4sjky6jYH8"
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
