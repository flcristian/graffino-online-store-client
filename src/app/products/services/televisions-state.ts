import {Television} from "../models/television.model";

export interface TelevisionsState {
  televisions: Television[],
  filteredTelevisions: Television[],
  error: string | null,
  loading: boolean
}
