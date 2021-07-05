import {AuthCheckoutItem} from "./auth-checkout-item-model";

export class AuthCheckout {
  products!: AuthCheckoutItem;
  overallPrice!: number;
  firstName!: string;
  lastName!: string;
  phoneNumber!: string;
  email!: string;
  city!: string;
  street!: string;
  house!: string;
  apartment!: string;
}
