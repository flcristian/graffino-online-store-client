import { Injectable } from '@angular/core';
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {CurrentUserState} from "./current-user-state";
import {MessageService} from "primeng/api";
import {UserService} from "./user.service";
import {Token} from "../models/token.model";
import {User} from "../models/user.model";
import {LoginRequest} from "../models/login-request.model";
import {LoginResponse} from "../models/login-response.model";
import {Router} from "@angular/router";
import {RegisterRequest} from "../models/register-request.model";
import {OrderService} from "../../orders/services/order.service";
import {Order} from "../../orders/models/order.model";
import {ChangePasswordRequest} from "../models/change-password-request.model";
import {OrderDetail} from "../../order-details/models/order-detail.model";
import {Product} from "../../products/models/product.model";
import {CheckoutProductDetailDTO} from "../../orders/models/checkout-product-detail-dto";
import {CheckoutRequest} from "../../orders/models/checkout-request.model";
import {LocalStorageService} from "../../utlity/services/local-storage.service";
import {SiteSettings} from "../models/site-settings.model";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserStateService {
  private stateSubject = new BehaviorSubject<CurrentUserState>({
    token: null,
    user: null,
    orders: [],
    cart: null,
    wishlist: null,
    errorUser: null,
    loadingUser: false,
    errorOrders: null,
    loadingOrders: false,
    errorCart: null,
    loadingCart: false,
    settings: {
      currency: "EUR",
      language: "en",
      theme: "light"
    }
  })
  state$: Observable<CurrentUserState> = this.stateSubject.asObservable()

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  // SERVICE CALLS
  register(request: RegisterRequest) {
    this.setLoadingUser(true)
    this.userService.register(request).pipe(
      finalize(() => {
        this.setLoadingUser(false);
      })
    ).subscribe({
      next: () => {
        setTimeout(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully registered your account! You can now sign in.` });
        }, 150)
        this.router.navigate(["login"])
      },
      error: (error) => {
        this.setErrorUser(error)
      },
      complete: () => {
        this.setLoadingUser(false)
      }
    })
  }

  login(request: LoginRequest){
    this.setLoadingUser(true)
    this.userService.login(request).pipe(
      finalize(() => {
        this.setLoadingUser(false);
      })
    ).subscribe({
      next: (response: LoginResponse) => {
        let token: Token = {
          tokenType: response.tokenType,
          accessToken: response.accessToken
        }
        this.setToken(token)
        this.getUserDetails()
      },
      error: (error) => {
        this.setErrorUser(error)
      }
    })
  }

  getUserDetails() {
    this.setLoadingUser(true)
    let token = this.stateSubject.value.token!;
    this.userService.getUserDetails(token).subscribe({
      next: (user: User) => {
        if(user.roles.indexOf("Banned") !== -1) {
          this.messageService.add({ severity: 'error', summary: 'Unauthorized', detail: `Your account has been locked from logging in.` });
          this.setToken(null)
          return;
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
        let settings: SiteSettings = {
          currency: "EUR",
          language: "en",
          theme: "light"
        }

        let storageState = this.localStorageService.retrieveUser(user.email)
        if(storageState !== null) {
          this.setState({
            user: storageState.user,
            token: token,
            cart: storageState.cart,
            wishlist: storageState.wishlist,
            settings: storageState.settings
          })
        } else {
          this.setState({
            user: user,
            token: token,
            cart: cart,
            wishlist: wishlist,
            settings: settings
          })
        }

        this.getOrders()

        this.router.navigate(["home"])
      },
      error: (error) => {
        this.setErrorUser(error)
      },
      complete: () => {
        this.setLoadingUser(false)
      }
    })
  }

  getToken() {
    return this.stateSubject.value.token;
  }

  getOrders() {
    this.setLoadingOrders(true)

    let customerId: string = this.stateSubject.value.user!.id;
    this.orderService.getOrdersByCustomerId(customerId).pipe(
      finalize(() => {
        this.setLoadingOrders(false);
      })
    ).subscribe({
      next: (orders: Order[]) => {
        this.setOrders(orders)
      },
      error: (error) => {
        this.setErrorOrders(error)
      },
      complete: () => {
        this.setLoadingOrders(false)
      }
    })
  }

  addToCart(product: Product) {
    let cart = this.stateSubject.value.cart!

    let orderDetail: OrderDetail = {
      id: 1,
      orderId: cart!.id,
      productId: product.id,
      count: 1,
      product: product
    }

    let index = this.stateSubject.value.cart!.orderDetails.findIndex(od => od.productId == product.id)
    if(index === -1) {
      cart.orderDetails.push(orderDetail)
    }
    else {
      this.messageService.add({ summary: 'Failed', detail: `Item is already in your cart.` });
    }

    this.setCart(cart)
  }

  removeFromCart(id: number) {
    let cart = this.stateSubject.value.cart!

    let index = this.stateSubject.value.cart!.orderDetails.findIndex(od => od.productId == id)
    if(index !== -1) {
      cart.orderDetails.splice(index, 1)
    }

    this.setCart(cart)
  }

  addToWishlist(product: Product) {
    let wishlist = this.stateSubject.value.wishlist!

    let orderDetail: OrderDetail = {
      id: 1,
      orderId: wishlist!.id,
      productId: product.id,
      count: 1,
      product: product
    }

    let index = this.stateSubject.value.wishlist!.orderDetails.findIndex(od => od.productId == product.id)
    if(index === -1) {
      wishlist.orderDetails.push(orderDetail)
    }
    else {
      this.messageService.add({ summary: 'Failed', detail: `Item is already in your wishlist.` });
    }

    this.setWishlist(wishlist)
  }

  removeFromWishlist(id: number) {
    let wishlist = this.stateSubject.value.wishlist!

    let index = this.stateSubject.value.wishlist!.orderDetails.findIndex(od => od.productId == id)
    if(index !== -1) {
      wishlist.orderDetails.splice(index, 1)
    }

    this.setWishlist(wishlist)
  }

  changePassword(currentPassword: string, newPassword: string) {
    this.setLoadingUser(true)

    let email: string = this.stateSubject.value.user!.email;
    let request: ChangePasswordRequest = {
      email: email,
      currentPassword: currentPassword,
      newPassword: newPassword
    }

    this.userService.changePassword(request).pipe(
        finalize(() => {
          this.setLoadingUser(false);
        })
      ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully changed your password.` });
        this.logout()
      },
      error: (error) => {
        this.setErrorUser(error)
      },
      complete: () => {
        this.setLoadingUser(false)
      }
    })
  }

  checkout() {
    let cart = this.stateSubject.value.cart!
    let productDetails: CheckoutProductDetailDTO[] = []

    let request: CheckoutRequest = {
      productDetails: productDetails,
      orderRequest: {
        customerId: cart.customerId,
        orderDetails: []
      }
    }

    cart.orderDetails.forEach(od => {
      productDetails.push({
        name: od.product!.name,
        price: od.product!.price,
        count: od.count
      })

      request.orderRequest.orderDetails.push({
        productId: od.productId,
        count: od.count
      })
    })

    this.orderService.createCheckoutSession(request)
  }

  isAdmin(): boolean {
    return !!(this.stateSubject.value.user && this.stateSubject.value.user.roles.indexOf("Administrator") !== -1);
  }

  getCurrency(): string {
    return this.stateSubject.value.settings.currency
  }

  // STATE SETTERS
  setToken(token: Token | null) {
    this.setState({token})
  }

  setUser(user: User | null) {
    this.setState({ user });
  }

  setCart(cart: Order | null) {
    this.setState({ cart });
  }

  setWishlist(wishlist: Order | null) {
    this.setState({ wishlist });
  }

  setOrders(orders: Order[]) {
    this.setState({orders})
  }

  setErrorUser(errorUser: string | null) {
    this.setState({errorUser})
  }

  setLoadingUser(loadingUser: boolean) {
    this.setState({loadingUser})
  }

  setErrorOrders(errorOrders: string | null) {
    this.setState({errorOrders})
  }

  setLoadingOrders(loadingOrders: boolean) {
    this.setState({loadingOrders})
  }

  setErrorCart(errorCart: string | null) {
    this.setState({errorCart})
  }

  setLoadingCart(loadingCart: boolean) {
    this.setState({loadingCart})
  }

  setSettings(settings: SiteSettings) {
    this.setState({settings})
  }

  setCurrency(currency: string) {
    let settings = this.stateSubject.value.settings
    settings.currency = currency

    this.setState({settings})
  }

  setLanguage(language: string) {
    let settings = this.stateSubject.value.settings
    settings.language = language

    this.setState({settings})
  }

  setTheme(theme: string) {
    let settings = this.stateSubject.value.settings
    settings.theme = theme

    this.setState({settings})
  }

  setState(partialState: Partial<CurrentUserState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
    this.saveStateToLocalStorage()
  }

  saveStateToLocalStorage() {
    let currentUser = this.stateSubject.value.user;
    if(currentUser) {
      this.localStorageService.saveUser({
        user: currentUser,
        token: this.stateSubject.value.token,
        tokenDate: null,
        cart: this.stateSubject.value.cart!,
        wishlist: this.stateSubject.value.wishlist!,
        settings: this.stateSubject.value.settings
      });
    }
  }

  logout() {
    let currentUser = this.stateSubject.value.user
    if(currentUser) {
      this.localStorageService.logUserOut(currentUser.email)
    }

    this.stateSubject.next({
      token: null,
      user: null,
      orders: [],
      cart: null,
      wishlist: null,
      errorUser: null,
      loadingUser: false,
      errorOrders: null,
      loadingOrders: false,
      errorCart: null,
      loadingCart: false,
      settings: {
        currency: "EUR",
        language: "en",
        theme: "light"
      }
    })
    this.router.navigate(["login"])
  }

  loggedIn() {
    return this.stateSubject.value.user != null && this.stateSubject.value.token != null;
  }
}
