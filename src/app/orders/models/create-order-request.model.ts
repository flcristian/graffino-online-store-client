import {CreateOrderDetailRequest} from "./create-order-detail-request.model";

export interface CreateOrderRequest {
  customerId: string,
  orderDetails: CreateOrderDetailRequest[]
}
