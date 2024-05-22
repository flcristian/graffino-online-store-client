import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import {ConfirmationService, MessageService} from "primeng/api";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpErrorInterceptor} from "./interceptors/http-error.interceptor";
import {ButtonModule} from "primeng/button";
import {LoginComponent} from "./users/login/login.component";
import {RegisterComponent} from "./users/register/register.component";
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MessageModule} from "primeng/message";
import {CustomerAccountPageComponent} from "./users/customer-account-page/customer-account-page.component";
import {ChangePasswordComponent} from "./users/change-password/change-password.component";
import {YourOrdersComponent} from "./users/your-orders/your-orders.component";
import {OrderStatusPipe} from "./pipes/order-status.pipe";
import {ProductsListComponent} from "./products/products-list/products-list.component";
import {ClothingListComponent} from "./products/clothing-list/clothing-list.component";
import {TelevisionsListComponent} from "./products/televisions-list/televisions-list.component";
import {RippleModule} from "primeng/ripple";
import {DataViewModule} from "primeng/dataview";
import {CartComponent} from "./users/cart/cart.component";

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CustomerAccountPageComponent,
    ChangePasswordComponent,
    YourOrdersComponent,
    OrderStatusPipe,
    ProductsListComponent,
    ClothingListComponent,
    TelevisionsListComponent,
    CartComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        ButtonModule,
        ToastModule,
        InputTextModule,
        MessageModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RippleModule,
        DataViewModule,
        FormsModule
    ],
  providers: [
    ConfirmationService,
    MessageService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:HttpErrorInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
