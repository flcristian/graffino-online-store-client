import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./users/login/login.component";
import {RegisterComponent} from "./users/register/register.component";
import {CustomerAccountPageComponent} from "./users/customer-account-page/customer-account-page.component";
import {ChangePasswordComponent} from "./users/change-password/change-password.component";
import {YourOrdersComponent} from "./users/your-orders/your-orders.component";
import {ProductsListComponent} from "./products/products-list/products-list.component";
import {CartComponent} from "./users/cart/cart.component";
import {PaymentSuccessfulComponent} from "./orders/payment-successful/payment-successful.component";
import {PaymentCanceledComponent} from "./orders/payment-canceled/payment-canceled.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'account', redirectTo: 'account/your-orders', pathMatch: 'full' },
  { path: 'products', redirectTo: 'products', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'account',
    component: CustomerAccountPageComponent,
    children: [
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'your-orders', component: YourOrdersComponent },
    ]
  },
  { path: 'payment-successful', component: PaymentSuccessfulComponent },
  { path: 'payment-canceled', component: PaymentCanceledComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
