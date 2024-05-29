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
      accessToken: "CfDJ8DswkO2bWyNHhZsQUZkwQnKgRS_UN0Y2n1L4Keg46eYkwnt6KoothptomgXJjZZRnTWmgU2W9H-ofzk8OksRaK-_r4d8HW6tEto7ufaHAfWTpu0zpJLwM0UxzA5-pPQXvouK71YaRZCcNbNx2EWobd_GEl3NyYAuhdmPX2WkKjns3ZtZw0kPtbEI8EFT5sxVgZ17M3J2k9Dm7YhTc4-AD3Q4jpxUXLRwWC83CJoJWsCwEsAMRYAn3mmkmMMk1B9xbuUeZIy1_AQ7gpM1vrA1qZvWLvH4jFJc25vuBX4jq8qW5FR2wKKNJ9HYREDaH8PggegR37gmGiIgcZnSwJvSZEmuviil1pXkxnZ1rsVln8qiQPAlKFvYV93W5kNC65a2VXRgeEchJjVI75bX8P5wWhqaeETApT04p3U02eFuTn03TFLHt0KxsVjtzZHeVg3nfUPPYno5-VJ2YEFX0NX-tvZnEK5dEXA1UB3_DouNHt0mAcR-wBNeBPS6C4so0pKDwBqlwAk_2j84MWg9W6Xnepn_L81wz-68FzNxMuPANR4rE0fsnvBgLNGxIB_DxQ08JZcxDkPD4ne_ilFBmiVbFD02XOFOm-OnLEeXNwl2QaBr-im0nsONSZ_9OSCQMxqndnlQ1ubRznFI2gZzBkQUfY86S_fKgAmj0OIqiE8eEwI8eN5cNbWIclj5hzyStbD052K90rvRVgpW0mYPEeEg5h9-iNRd9-CxH53JYC27AsXCExuW8AotGTHQH7NBMoL4TOKY5Z-47ii_TKKBV037wO8ten57Mq1B6wjin_QfKz3CQCP1QzsrZQ5DCBVv3RVzKcaGVHXjNjPBSE8eBHRQ9Xk"
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
