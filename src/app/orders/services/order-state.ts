import {Order} from "../models/order.model";

export interface OrderState {
  order: Order | null,
  error: string | null,
  loading: boolean
}
