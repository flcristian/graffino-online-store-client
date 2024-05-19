import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CurrentUserState} from "./current-user-state";
import {MessageService} from "primeng/api";
import {UserService} from "./user.service";
import {Token} from "../models/token.model";
import {User} from "../models/user.model";
import {LoginRequest} from "../models/login-request.model";
import {LoginResponse} from "../models/login-response.model";
import {Router} from "@angular/router";
import {RegisterRequest} from "../models/register-request.model";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserStateService {
  private stateSubject = new BehaviorSubject<CurrentUserState>({
    token: null,
    user: null,
    error: null,
    loading: false
  })
  state$: Observable<CurrentUserState> = this.stateSubject.asObservable()

  constructor(
    private messageService: MessageService,
    private service: UserService,
    private router: Router
  ) { }

  // SERVICE CALLS
  register(request: RegisterRequest) {
    this.setLoading(true)
    this.service.register(request).subscribe({
      next: () => {
        setTimeout(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully registered your account! You can now sign in.` });
        }, 150)
        this.router.navigate(["login"])
      },
      error: (error) => {
        this.setError(error)
      },
      complete: () => {
        this.setLoading(false)
      }
    })
  }

  login(request: LoginRequest){
    this.setLoading(true)
    this.service.login(request).subscribe({
      next: (response: LoginResponse) => {
        let token: Token = {
          tokenType: response.tokenType,
          accessToken: response.accessToken
        }

        this.setToken(token)
        this.getUserDetails()
      },
      error: (error) => {
        this.setError(error)
      },
      complete: () => {
        this.setLoading(false)
      }
    })
  }

  getUserDetails() {
    this.setLoading(true)
    let token = this.stateSubject.value.token!;
    this.service.getUserDetails(token).subscribe({
      next: (user: User) => {
        this.setUser(user)
        this.router.navigate(["home"])
      },
      error: (error) => {
        this.setError(error)
      },
      complete: () => {
        this.setLoading(false)
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

  setError(error: string | null) {
    this.setState({error})
  }

  setLoading(loading: boolean) {
    this.setState({loading})
  }

  setState(partialState: Partial<CurrentUserState>){
    this.stateSubject.next({...this.stateSubject.value,...partialState})
  }
}
