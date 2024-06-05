import {Product} from "../models/product.model";
import {Category} from "../models/category.model";

export interface ProductsState {
  categories: Category[],
  products: Product[],
  totalPages: number | null,
  filterCriteria: { [key: string]: string[] },
  errorCategories: string | null,
  errorProducts: string | null,
  errorFilterCriteria: string | null,
  loadingCategories: boolean,
  loadingProducts: boolean,
  loadingFilterCriteria: boolean
}
