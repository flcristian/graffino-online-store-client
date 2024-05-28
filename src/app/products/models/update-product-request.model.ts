import {UpdateProductPropertyRequest} from "./update-product-property-request.model";

export interface UpdateProductRequest {
  id: number,
  name: string,
  price: number,
  imageUrl: string,
  productProperties: UpdateProductPropertyRequest[]
}
