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
import {ProductPageComponent} from "./products/product-page/product-page.component";
import {WishlistComponent} from "./users/wishlist/wishlist.component";
import {AdministratorPageComponent} from "./administrator/administrator-page/administrator-page.component";
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import {ProductsManagerComponent} from "./administrator/products-manager/products-manager.component";
import {CustomersManagerComponent} from "./administrator/customers-manager/customers-manager.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'account', redirectTo: 'account/your-orders', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'admin/products', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'product/:id', component: ProductPageComponent },

  { path: 'admin',
    component: AdministratorPageComponent,
    children: [
      { path: 'products', component: ProductsManagerComponent },
      { path: 'customers', component: CustomersManagerComponent },
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'account',
    component: CustomerAccountPageComponent,
    children: [
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'your-orders', component: YourOrdersComponent },
    ]
  },

  { path: 'payment-successful', component: PaymentSuccessfulComponent },
  { path: 'payment-canceled', component: PaymentCanceledComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
