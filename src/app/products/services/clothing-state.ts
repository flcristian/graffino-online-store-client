import {Clothing} from "../models/clothing.model";

export interface ClothingState {
  clothing: Clothing[],
  filteredClothing: Clothing[],
  error: string | null,
  loading: boolean
}
