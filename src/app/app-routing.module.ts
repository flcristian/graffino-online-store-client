import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./users/login/login.component";
import {RegisterComponent} from "./users/register/register.component";
import {AccountPageComponent} from "./users/account-page/account-page.component";
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
import {CategoriesManagerComponent} from "./administrator/categories-manager/categories-manager.component";
import {OrdersManagerComponent} from "./administrator/orders-manager/orders-manager.component";
import {OrderPageComponent} from "./orders/order-page/order-page.component";
import {WebsiteSettingsComponent} from "./users/website-settings/website-settings.component";

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
      { path: 'categories', component: CategoriesManagerComponent },
      { path: 'products', component: ProductsManagerComponent },
      { path: 'orders', component: OrdersManagerComponent },
    ]
  },

  { path: 'order/:id', component: OrderPageComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'account',
    component: AccountPageComponent,
    children: [
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'your-orders', component: YourOrdersComponent },
      { path: 'site-settings', component: WebsiteSettingsComponent },
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
