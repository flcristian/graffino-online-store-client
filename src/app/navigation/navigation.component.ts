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
      accessToken: "CfDJ8DswkO2bWyNHhZsQUZkwQnIv2VTFjtgrrC7etkLMLg8v6svsZFXaHVsr__suiNuN-n0R0fnNAcPWiJ_N0tkFDfVjY8Aknj3ap8GTK62XUOv3OIs-gBaiJDhbk3-ag7A2dGO0MXR5eqROxs67A2_czeTwPsc7x5ys_xkjjf8t22z3AcYrK3BaLGo48Yds8gWhp2twpXOPzmAr3_Ql2plBiWu0lI7v-CqYURnPn_LR5DXiXtVmuco0LgwDg87Elg-iSFjSFaiDkr3RUgHrZzF70Y-E4EZ8vY0-yZrIGrLN1zw10EMbl8YFKHXP0C8sS2RwhwIUXP_Zs1gqyQ-EVcyjumk5aCgOzMcOheJh3-Q-Z-gERhrqROG-S5h-nMLgUkgPTCSVlIX_8oNeJyN9AVP88okt3WmcjgIYk9ATdiEhEGjmwIIG-UdRJNWwNOE2yRC1a6sKU4_Rq-MhLUFvx2MHEqiSP6TYryfbkggMcPwdZPqyGt_7K9mZ-3ItGll54N22q_MUFP57NZyO7DfadC-LXajLuqhFtkyH7DPRlW0SO_I9RgdvWZvNoL_TZUOVKY7ScmF5MAp7DhVzIPmMvVWEaQZzuzmWZXkOOjq6jbFJSc13lqBZdHOS0lZY7DdVMlKz0zMDsVEUOIDUd6xn7M-ktBQvcAmpbjpvIQyVRuoPDV2CmjAPvIuQLNpmIFHaBlUzqwl_VacJnCmY8dp6PAzY8sDq5B_EhHb92UYW3jxJBcRu_CO5p9e-x1jLSVpfmREDbW0OInEJrOl0n9YEuyaNGuwbIe6FPepNFlMYnhSJb7JZ2FAM5qahF-qHvvZfl3UqnCoKSvlo55kPjKIMhdhTdjw"
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
