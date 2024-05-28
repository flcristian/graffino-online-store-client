import { Component } from '@angular/core';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  email: string = ""

  constructor(
    private messageService: MessageService
  ) { }

  subscribe() {
    if(this.email.trim() !== "") {
      this.email = ""
      this.messageService.add({
        severity: 'success',
        summary: "Thank you!",
        detail: "You have successfully subscribed to our newsletter!"
      });
    }
  }
}
