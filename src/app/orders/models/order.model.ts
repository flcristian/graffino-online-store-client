import {User} from "../../users/models/user.model";
import {OrderDetail} from "../../order-details/models/order-detail.model";

export interface Order {
  id: number,
  customerId: string,
  status: number,
  lastDateUpdated: Date,
  customer: User,
  orderDetails: OrderDetail[]
}
