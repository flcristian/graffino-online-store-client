import { Component } from '@angular/core';
import {Subscription} from "rxjs";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Router} from "@angular/router";
import {RegisterRequest} from "../models/register-request.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private subscriptions = new Subscription()
  registerForm: FormGroup = new FormGroup({})
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
    this.registerForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        this.validateContainsCapitalLetter,
        this.validateContainsDigit,
        this.validateContainsSymbol
      ]),
      confirmPassword: new FormControl("", [
        Validators.required
      ])
    }, { validators: this.confirmedPasswordValidator, updateOn: "change" });
  }

  register() {
    let request: RegisterRequest = {
      email: this.registerForm.value.email as string,
      password: this.registerForm.value.password as string
    };

    this.state.register(request)
  }

  navigateToLogin() {
    this.router.navigate(["login"])
  }

  // PRIVATE METHODS

  private validateContainsCapitalLetter(control: FormControl): ValidationErrors | null {
    const password = control.value;

    if(!/[A-Z]/.test(password)) {
      return { noCapitalLetter: true }
    }

    return null
  }

  private validateContainsDigit(control: FormControl): ValidationErrors | null {
    const password = control.value;

    if(!/[0-9]/.test(password)) {
      return { noDigit: true }
    }

    return null
  }

  private validateContainsSymbol(control: FormControl): ValidationErrors | null {
    const password = control.value;

    if(!/[@$!%*?&,.<>/;_+]/.test(password)) {
      return { noSymbol: true }
    }

    return null
  }

  private confirmedPasswordValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }
}
