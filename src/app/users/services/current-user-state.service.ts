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

@Injectable({
  providedIn: 'root'
})
export class CurrentUserStateService {
  private stateSubject = new BehaviorSubject<CurrentUserState>({
    token: null,
    user: null,
    orders: [],
    errorUser: null,
    loadingUser: false,
    errorOrders: null,
    loadingOrders: false
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
    this.orderService.getOrdersByCustomerId(customerId).subscribe({
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

  setState(partialState: Partial<CurrentUserState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
