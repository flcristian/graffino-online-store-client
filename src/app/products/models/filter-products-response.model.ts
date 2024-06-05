import {Product} from "./product.model";

export interface FilterProductsResponse {
  products: Product[],
  totalPages: number
}
