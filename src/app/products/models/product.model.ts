import {ProductProperty} from "./product-property.model";
import {Category} from "./category.model";

export interface Product {
  id: number,
  name: string,
  price: number,
  categoryId: number,
  dateAdded: Date,
  imageUrl: string,
  productProperties: ProductProperty[],
  category: Category
}
