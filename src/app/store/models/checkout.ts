import {ProductCheckoutDto} from "./productCheckout";

export class CheckoutDto {
  products: ProductCheckoutDto[]
  overallPrice: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  city: string;
  street: string;
  house: string;
  apartment: string;

  constructor(products: ProductCheckoutDto[], overallPrice: number, firstName: string, lastName: string, phoneNumber: string, email: string, city: string, street: string, house: string, apartment: string) {
    this.products = products;
    this.overallPrice = overallPrice;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.city = city;
    this.street = street;
    this.house = house;
    this.apartment = apartment;
  }
}

