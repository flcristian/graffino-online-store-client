import {Component, OnInit} from '@angular/core';
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-administrator-page',
  templateUrl: './administrator-page.component.html'
})
export class AdministratorPageComponent implements OnInit {
  constructor(
    private currentUserState: CurrentUserStateService,
    private router: Router
  ) { }

  ngOnInit() {
    if(!this.currentUserState.isAdmin()) {
      this.router.navigate(["unauthorized"])
    }
  }

  selectProducts() {
    this.router.navigate(["admin/products"])
  }

  selectOrders() {
    this.router.navigate(["admin/orders"])
  }

  selectCategories() {
    this.router.navigate(["admin/categories"])
  }
}
