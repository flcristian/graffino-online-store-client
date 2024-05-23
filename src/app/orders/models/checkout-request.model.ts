import {CheckoutProductDetailDTO} from "./checkout-product-detail-dto";
import {CreateOrderRequest} from "./create-order-request.model";

export interface CheckoutRequest {
  productDetails: CheckoutProductDetailDTO[],
  orderRequest: CreateOrderRequest
}
