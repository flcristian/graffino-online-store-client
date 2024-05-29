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
import {RippleModule} from "primeng/ripple";
import {DataViewModule} from "primeng/dataview";
import {CartComponent} from "./users/cart/cart.component";
import {PaymentCanceledComponent} from "./orders/payment-canceled/payment-canceled.component";
import {PaymentSuccessfulComponent} from "./orders/payment-successful/payment-successful.component";
import {ProductPageComponent} from "./products/product-page/product-page.component";
import {
  ProductRecommendationCarouselComponent
} from "./products/product-recommendation-carousel/product-recommendation-carousel.component";
import {CarouselModule} from "primeng/carousel";
import { FooterComponent } from './footer/footer.component';
import {WishlistComponent} from "./users/wishlist/wishlist.component";
import {AdministratorPageComponent} from "./administrator/administrator-page/administrator-page.component";
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import {ProductsManagerComponent} from "./administrator/products-manager/products-manager.component";
import {CustomersManagerComponent} from "./administrator/customers-manager/customers-manager.component";
import { CategoriesManagerComponent } from './administrator/categories-manager/categories-manager.component';
import {ConfirmPopupModule} from "primeng/confirmpopup";

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
    CartComponent,
    PaymentSuccessfulComponent,
    PaymentCanceledComponent,
    ProductPageComponent,
    ProductRecommendationCarouselComponent,
    FooterComponent,
    WishlistComponent,
    AdministratorPageComponent,
    UnauthorizedComponent,
    ProductsManagerComponent,
    CustomersManagerComponent,
    CategoriesManagerComponent
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
    FormsModule,
    CarouselModule,
    ConfirmPopupModule
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
