import {Property} from "./property.model";

export interface Category {
  id: number,
  name: string,
  properties: Property[]
}
