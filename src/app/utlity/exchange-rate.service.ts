import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest/EUR';

  constructor(private http: HttpClient) { }

  getExchangeRate(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
