import {Token} from "./token.model";
import {User} from "./user.model";
import {Order} from "../../orders/models/order.model";
import {SiteSettings} from "./site-settings.model";

export interface CurrentUserLocalStorage {
  user: User,
  token: Token | null,
  tokenDate: Date | null,
  cart: Order,
  wishlist: Order,
  settings: SiteSettings
}
