export class AuthCheckoutItem {
  productId!: number;
  name!: string;
  color!: string;
  sizeId!: number;
  size!: string;
  photo!: string;
  amount!: number;
  sum!: number;

  constructor(
    productId: number,
    name: string,
    color: string,
    sizeId: number,
    size: string,
    photo: string,
    amount: number,
    sum: number
  ) {
    this.productId = productId;
    this.name = name;
    this.color = color;
    this.sizeId = sizeId;
    this.size = size;
    this.photo = photo;
    this.amount = amount;
    this.sum = sum;
  }
}
