import {CreateCategoryPropertyRequest} from "./create-category-property-request.model";

export interface CreateCategoryRequest {
  name: string,
  properties: CreateCategoryPropertyRequest[]
}
