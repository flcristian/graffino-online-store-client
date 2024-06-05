import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { catchError, Observable, throwError } from "rxjs";
import {Router} from "@angular/router";
import {CurrentUserStateService} from "../users/services/current-user-state.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private userState: CurrentUserStateService,
    private messageService: MessageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.getErrorMessage(error, request.url);
          if (!this.ignoreError(error, request.url)) {
            this.displayError(error, errorMessage, request.url);
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  ignoredMessages = [
    "This customer has no orders.",
    "There are no products matching your search and filter criteria.",
    "The customer has no cart.",
    "Unexpected error occurred."
  ]

  private ignoreError(error: HttpErrorResponse, url: string): boolean {
    if(this.ignoredMessages.indexOf(error.error.message) !== -1 ||
        this.ignoredMessages.indexOf(error.error) !== -1) {
      return true;
    }

    if (url.includes('/register') && error.status === 400) return true;

    return false;
  }

  private getErrorMessage(error: HttpErrorResponse, url: string): string {
    if (url.includes('/login') && error.status === 0) {
      this.userState.logout()
      return `Email or password is incorrect. Please try again.`;
    }

    if (error.error instanceof ErrorEvent) {
      return `Client-side error: ${error.error.message}`;
    }

    if (typeof error.error === 'string') {
      return `Server-side error: ${error.error}`;
    }

    return `Unexpected error occurred.`;
  }

  private displayError(error: HttpErrorResponse, errorMessage: string, url: string): void {
    const summary = `${error.statusText}`;

    let message = {
      severity: 'error',
      summary,
      detail: errorMessage
    }

    if (url.includes('/login') && error.status === 0) message.summary = "Invalid credentials";

    this.messageService.add(message);
  }
}
