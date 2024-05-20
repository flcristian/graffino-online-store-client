import { Component } from '@angular/core';
import {CurrentUserStateService} from "../services/current-user-state.service";

@Component({
  selector: 'app-your-orders',
  templateUrl: './your-orders.component.html'
})
export class YourOrdersComponent {
  constructor(
    protected state: CurrentUserStateService
  ) { }
}
