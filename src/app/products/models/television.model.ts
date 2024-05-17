import {Product} from "./product.model";

export interface Television extends Product {
  diameter: string,
  resolution: string
}
