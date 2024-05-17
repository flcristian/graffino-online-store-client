import {Product} from "./product.model";

export interface Clothing extends Product {
  color: string,
  style: string,
  size: string
}
