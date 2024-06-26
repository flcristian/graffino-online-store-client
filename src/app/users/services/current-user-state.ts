import {User} from "../models/user.model";
import {Token} from "../models/token.model";
import {Order} from "../../orders/models/order.model";
import {SiteSettings} from "../models/site-settings.model";

export interface CurrentUserState {
  token: Token | null,
  user: User | null,
  orders: Order[],
  cart: Order | null,
  wishlist: Order | null,
  errorUser: string | null,
  loadingUser: boolean,
  errorOrders: string | null,
  loadingOrders: boolean,
  errorCart: string | null,
  loadingCart: boolean,
  settings: SiteSettings
}
