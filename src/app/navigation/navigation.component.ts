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

    let token: Token = {
      tokenType: "Bearer",
      accessToken: "CfDJ8DswkO2bWyNHhZsQUZkwQnLresTL7vV866KWFqTTcoXZN0iKArZSkj0W8pirNQBG0XNFTYHUgrl9S_jw0qoKQ7InD9nXj_wZW-onOLecbbXIcEIQdn97dU9NOExmsb0MBcyILGPdVC3pxqyZN1tFv8IEqFSnxE6CyBTwq1EJcsgeMoq_ifKl1O4lq53QfChOgoZc-pe2LQe1ujQPcH2QE5gMCn-VjrQvDuDXnweybhGxiXYBrAA3K-w6ohdLlaqc11JT5ocO0Gn0LIq_cr0fG9sUE69Yj4AU2e5q6gjDFl5-jtzl1TaS6rsw0FXaMjGmafqnhHoIMc6xceECIctEYd3RXCZr3gbvm_KuG5CrokiiKou7MtDdwK5VsVGmo_cr8Z-7QJ1oOzG-DQKdtR9mm4FbjEbyClrUbFCIL9nZ_16buGfc8tg-3QLtJgwlp2Xf_zNctKOCoQKwaftGG8HHGupoAxEybGtPm_jsmKcYuhYE7NixxXjQ_VSlB9f0vlRc-wPpIwl0GC6cmgNSsZYpnObLxEcxxq-S7gWCbYqLaWMveshNWWM6fjEyjA73-ruhOon7z7kYKF5A61Oc0E5atbtfzlRzmAFGK8ChzNKhLNaqIL5V_zMb4UflROT1hBW0FrfDd9VztWF1CtLNPr-0RXXfVaCM1fP-S6FfZLZDEbne8aIHoUOnEc6MNcYd-HaE46upEcUl_46klTDeI8sPa2jM_nHCf-M5sWkvzYBZOF_cTlaMo-tVA_gRET4bC34rBUrSa2ausGMDg1wmktMtKoLXSvVUWoWV5pj9pr_Nltc_YP_agi86sNHAHconjr8BXoqsPKhMDmYRhYhrkGI35l8"
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
