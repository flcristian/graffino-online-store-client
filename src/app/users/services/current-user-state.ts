import {User} from "../models/user.model";
import {Token} from "../models/token.model";

export interface CurrentUserState {
  token: Token | null,
  user: User | null,
  error: string | null,
  loading: boolean
}
