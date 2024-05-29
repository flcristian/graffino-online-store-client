import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Router} from "@angular/router";
import {LoginRequest} from "../models/login-request.model";
import {CurrentUserState} from "../services/current-user-state";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  loginForm: FormGroup = new FormGroup({})

  constructor(
    private messageService: MessageService,
    public state: CurrentUserStateService,
    private router: Router
  ) { }

  ngOnInit(){
    if(this.state.loggedIn()) {
      this.router.navigate(["home"])
    }

    this.initializeForms();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private initializeForms(){
    this.loginForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl("", [
        Validators.required
      ])
    }, {updateOn:'change'});
  }

  login() {
    let request: LoginRequest = {
      email: this.loginForm.value.email as string,
      password: this.loginForm.value.password as string,
      twoFactorCode: "",
      twoFactorRecoveryCode: ""
    };

    this.state.login(request)
  }

  checkAndLogin() {
    if(this.loginForm.valid) {
      this.login()
    }
  }

  navigateToRegister() {
    this.router.navigate(["register"])
  }
}
