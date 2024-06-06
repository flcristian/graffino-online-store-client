import {Component, OnInit} from '@angular/core';
import {CurrentUserStateService} from "./users/services/current-user-state.service";
import {LocalStorageService} from "./utlity/services/local-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  title= "graffino-online-store-client";
  constructor(
    private localStorageService: LocalStorageService,
    private currentUserStateService: CurrentUserStateService
  ) { }

  ngOnInit(): void {
    let state = this.localStorageService.retrieveLoggedInUser()
    if(state !== null && !this.localStorageService.tokenExpired(state)) {
      this.currentUserStateService.setState({
        user: state.user,
        token: state.token,
        cart: state.cart,
        wishlist: state.wishlist,
        settings: state.settings
      })
    }
  }
}
