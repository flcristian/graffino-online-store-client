import {Product} from "../models/product.model";

export interface ProductState {
  product: Product | null,
  error: string | null,
  loading: boolean
}
