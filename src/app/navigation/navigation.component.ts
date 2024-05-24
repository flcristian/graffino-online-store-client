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
      })
    )

    let token: Token = {
      tokenType: "Bearer",
      accessToken: "CfDJ8KPlH2Bs_pFHrhdy1pG9SJmX-ki6So69M6jY_QtxabxxDNZbNqiWHSdhr9EDMQ810ZqZwW6eyGKqZlEE0TNWQ3CzzO5fkAqmiIVJ4g6Hpr3pMJlhGzAvTn6qzmk1O_quiSa1Hv9RVTX3FTTkd6YWEeLRgbtY__dOx3G0hezcDRihY_hf548YebgL-sQBT9IZzKobIzvIAgllNg39KyHG3WBjOCYh0rGkbH8KE5dXmRNnZMpDlkaW60Zoj-rTboWxY34pI2WAfJPDp0qGuR4pJvZRgZ80qSU7mf9mMynti6hMk351Fa-wt1YiTNbNjXluI-I4NyOQ_pGyV-BfhZYRB48aEWVbERvFsJQfhJrihhkmE5SlSpgne9EY4cHXqLoC8WAizSWboLy9i3ktPaG3etV1tFIoXIL8o6zXB0nBQl3XWhtXjB41YLtNmlJOytiwBoKe1jT_1PvLsNN7instFhpIwTNEQ3QGFltwsWGGC6ZhBJ1gh_kW_VCSgDDVrrXYX0dIELrMrgtg5h-6Hf01fQh5s3ZA6-cEtZoIgxIpAYD4B9emuvA8Budl_2YOBWX8F-L6SRnvB4p7krEJ8RFeEpgXbScgWmWXvehqFX4-YRF48BFsBzDvrl1s3VxjzvI2J6ms2xQIrGYFyocxUnkvJtXQPRheVx5Rph4qCprWp1PaGVLDmxNuJaYbUVORCqJGONK7MbyiqWsPABaDA4vc6s9N7PWS3ZBCPaIwan2eGBdQagHKvlXs981SUm2PIbfHmSw0_AtFL_z5hNx-VBSfAQ3jMqK9JBAcSDrp_FZIDu1ziqS1lPXJUW6PkpkwtKmGOUVm_J4TaF2ySz_skxiZuRE"
    }

    let user: User = {
      id: "614176e5-98c8-473a-986e-e87515b2291a",
      email: "qflorescucristian@gmail.com",
      emailConfirmed: true,
      roles: []
    }
    let cart: Order = {
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
