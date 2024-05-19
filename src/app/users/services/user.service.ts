import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginRequest} from "../models/login-request.model";
import {RegisterRequest} from "../models/register-request.model";
import {Observable} from "rxjs";
import {LoginResponse} from "../models/login-response.model";
import {Token} from "../models/token.model";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authenticationServer: string = "http://localhost:5005";
  private userServer: string = "http://localhost:5005/api/v1/Users";

  constructor(private http: HttpClient) { }

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
}
