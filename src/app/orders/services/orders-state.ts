import {Order} from "../models/order.model";

export interface OrdersState {
  orders: Order[],
  error: string | null,
  loading: boolean
}
