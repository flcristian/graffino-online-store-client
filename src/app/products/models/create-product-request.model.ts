import {CreateProductPropertyRequest} from "./create-product-property-request.model";

export interface CreateProductRequest {
  name: string,
  price: number,
  categoryId: number,
  imageUrl: string,
  productProperties: CreateProductPropertyRequest[]
}
