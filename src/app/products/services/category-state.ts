import {Category} from "../models/category.model";
import {Product} from "../models/product.model";

export interface CategoryState {
  category: Category | null,
  products: Product[]
}
