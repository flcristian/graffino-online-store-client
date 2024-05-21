import {Clothing} from "../models/clothing.model";
import {Television} from "../models/television.model";

export interface ProductState {
  clothing: Clothing[],
  televisions: Television[],
  error: string | null,
  loading: boolean
}
