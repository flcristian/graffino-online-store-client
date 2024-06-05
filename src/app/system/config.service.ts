import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() {
  }

  public getHostName(): string {
    return `http://${window.location.hostname}:8080`
  }
}
