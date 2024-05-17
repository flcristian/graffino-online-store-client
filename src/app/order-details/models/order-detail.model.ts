import {Product} from "../../products/models/product.model";

export interface OrderDetail {
  id: number,
  orderId: number,
  productId: number,
  count: number,
  product: Product
}
