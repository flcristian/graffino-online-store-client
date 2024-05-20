import {User} from "../models/user.model";
import {Token} from "../models/token.model";
import {Order} from "../../orders/models/order.model";

export interface CurrentUserState {
  token: Token | null,
  user: User | null,
  orders: Order[]
  errorUser: string | null,
  loadingUser: boolean,
  errorOrders: string | null,
  loadingOrders: boolean
}
