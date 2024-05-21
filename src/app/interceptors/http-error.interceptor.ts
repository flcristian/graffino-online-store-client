import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.getErrorMessage(error);
          if (!this.shouldIgnoreError(error, request.url)) {
            this.displayError(error, errorMessage);
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  private shouldIgnoreError(error: HttpErrorResponse, url: string): boolean {
    if (url.includes('/register') && error.status === 400) {
      return true;
    }
    return false;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return `Invalid login credentials! Please try again.`;
    }

    if (error.error instanceof ErrorEvent) {
      return `Client-side error: ${error.error.message}`;
    }

    if (typeof error.error === 'string') {
      return `Server-side error: ${error.error}`;
    }

    return `Unexpected error occurred.`;
  }

  private displayError(error: HttpErrorResponse, errorMessage: string): void {
    const summary = `${error.statusText}`;

    this.messageService.add({
      severity: 'error',
      summary,
      detail: errorMessage
    });
  }
}
