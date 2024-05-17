import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Router} from "@angular/router";
import {LoginRequest} from "../models/login-request.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  loginForm: FormGroup = new FormGroup({})
  error: string | null = null

  constructor(
    private messageService: MessageService,
    public state: CurrentUserStateService,
    private router: Router
  ) { }

  ngOnInit(){
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
        Validators.required,
/*        Validators.minLength(8),
        Validators.maxLength(128),
        this.validateContainsCapitalLetter,
        this.validateContainsDigit,
        this.validateContainsSymbol*/
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
    console.log(request)

    this.state.login(request)
  }

  navigateToRegister() {
    this.router.navigate(["register"])
  }

  // PRIVATE METHODS

  private validateContainsCapitalLetter(control: FormControl): ValidationErrors | null {
    const password = control.value;

    if(!/[A-Z]/.test(password)) {
      return { noCapitalLetter: true }
    }

    return null;
  }

  private validateContainsDigit(control: FormControl): ValidationErrors | null {
    const password = control.value;

    if(!/[0-9]/.test(password)) {
      return { noDigit: true }
    }

    return null;
  }

  private validateContainsSymbol(control: FormControl): ValidationErrors | null {
    const password = control.value;

    if(!/[@$!%*?&]/.test(password)) {
      return { noSymbol: true }
    }

    return null;
  }
}
