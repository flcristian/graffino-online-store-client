import {Product} from "../models/product.model";

export interface ProductState {
  products: Product[],
  filterCriteria: { [key: string]: string[] },
  errorProducts: string | null,
  errorFilterCriteria: string | null,
  loadingProducts: boolean,
  loadingFilterCriteria: boolean
}
