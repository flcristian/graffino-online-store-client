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

@Injectable({
  providedIn: 'root'
})
export class CurrentUserStateService {
  private stateSubject = new BehaviorSubject<CurrentUserState>({
    token: null,
    user: null,
    orders: [],
    cart: null,
    errorUser: null,
    loadingUser: false,
    errorOrders: null,
    loadingOrders: false,
    errorCart: null,
    loadingCart: false
  })
  state$: Observable<CurrentUserState> = this.stateSubject.asObservable()

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router
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
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: `Email already used, sign in or try again using another email.`})
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

        this.setUser(user)

        this.getOrders()
        this.getCart()
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

  getCart() {
    this.setLoadingCart(true)

    let customerId: string = this.stateSubject.value.user!.id;
    this.orderService.getCartByCustomerId(customerId).pipe(
      finalize(() => {
        this.setLoadingCart(false);
      })
    ).subscribe({
      next: (cart: Order) => {
        this.setCart(cart)
      },
      error: (error) => {
        this.createCart();
        this.setErrorCart(error)
      },
      complete: () => {
        this.setLoadingCart(false)
      }
    })
  }

  createCart() {
    this.setLoadingCart(true)
    let customerId: string = this.stateSubject.value.user!.id;

    this.orderService.createCart(customerId).subscribe({
      next: (cart: Order) => {
        this.setCart(cart)
      },
      error: (error) => {
        this.setErrorCart(error)
      },
      complete: () => {
        this.setLoadingCart(false)
      }
    })
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
      },
      error: (error) => {
        this.setErrorUser(error)
      },
      complete: () => {
        this.setLoadingUser(false)
      }
    })
  }

  // STATE SETTERS
  setToken(token: Token | null) {
    this.setState({token})
  }

  setUser(user: User | null) {
    this.setState({user})
  }

  setOrders(orders: Order[]) {
    this.setState({orders})
  }

  setCart(cart: Order | null) {
    this.setState({cart})
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

  setState(partialState: Partial<CurrentUserState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
