import {Component, OnInit} from '@angular/core';
import {CurrentUserStateService} from "../services/current-user-state.service";
import {SiteSettings} from "../models/site-settings.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-website-settings',
  templateUrl: './website-settings.component.html'
})
export class WebsiteSettingsComponent implements OnInit {
  private subscriptions = new Subscription()
  settings: SiteSettings | null = null;

  constructor(
    private userState: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.userState.state$.subscribe(data => this.settings = data.settings)
    )
  }

  updateSettings() {
    if(this.settings) {
      this.userState.setSettings(this.settings)
    }
  }
}
