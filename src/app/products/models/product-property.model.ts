import {Property} from "./property.model";

export interface ProductProperty {
  id: number,
  productId: number,
  propertyId: number,
  value: string,
  property: Property
}
