import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginRequest} from "../models/login-request.model";
import {RegisterRequest} from "../models/register-request.model";
import {Observable} from "rxjs";
import {LoginResponse} from "../models/login-response.model";
import {Token} from "../models/token.model";
import {User} from "../models/user.model";
import {ChangePasswordRequest} from "../models/change-password-request.model";
import {ConfigService} from "../../system/config.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = '';
  private authenticationServer: string = '';
  private userServer: string = '';

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.getHostName();
    this.authenticationServer = this.apiUrl;
    this.userServer = `${this.apiUrl}/api/v1/Users`
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authenticationServer}/login`, request);
  }

  getUserDetails(token: Token): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `${token.tokenType} ${token.accessToken}`
    });

    return this.http.get<User>(`${this.userServer}/details`, { headers })
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.authenticationServer}/register`, request)
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.userServer}/change-password`, request)
  }
}
