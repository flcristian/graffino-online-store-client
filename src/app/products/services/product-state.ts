import {Product} from "../models/product.model";
import {Category} from "../models/category.model";

export interface ProductState {
  categories: Category[],
  products: Product[],
  filterCriteria: { [key: string]: string[] },
  errorCategories: string | null,
  errorProducts: string | null,
  errorFilterCriteria: string | null,
  loadingCategories: boolean,
  loadingProducts: boolean,
  loadingFilterCriteria: boolean
}
