import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() {
  }

  public getHostName(): string {
    let development = true
    if(development) return "http://localhost:5005"
    return `http://${window.location.hostname}:8080`
  }
}
