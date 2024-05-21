import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {CurrentUserStateService} from "../services/current-user-state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({})

  constructor(
    public state: CurrentUserStateService,
    private router: Router
  ) { }

  ngOnInit(){
    this.initializeForms();
  }

  private initializeForms(){
    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl("", [
        Validators.required
      ]),
      newPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128),
        this.validateContainsCapitalLetter,
        this.validateContainsDigit,
        this.validateContainsSymbol
      ]),
      confirmNewPassword: new FormControl("", [
        Validators.required
      ])
    }, { validators: this.confirmedPasswordValidator, updateOn: "change" });
  }

  changePassword() {
    let currentPassword = this.changePasswordForm.value.currentPassword as string;
    let newPassword = this.changePasswordForm.value.newPassword as string;

    this.state.changePassword(currentPassword, newPassword)
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
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;

    return newPassword === confirmNewPassword ? null : { passwordsDoNotMatch: true };
  }
}
