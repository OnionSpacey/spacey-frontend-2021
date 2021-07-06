import { Component, OnInit } from '@angular/core';
import { CartService } from '../../store/service/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductForCartModel } from '../../store/models/product-for-cart.model';
import { EditCartModel } from '../../store/models/edit-cart.model';
import { routeUrls } from '../../../environments/router-manager';
import { HeaderTitleService } from '../../store/service/header/header-title.service';
import { DialogService } from '../../store/service/dialog/dialog.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  products: ProductForCartModel[] = [];
  isProductsLoaded = false;
  checkoutAvailable = false;
  overallPrice = 0;

  constructor(
    private headerTitleService: HeaderTitleService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.headerTitleService.setTitle('shopping cart');
    this.loadData();
  }

  loadData(): void {
    this.getProducts();
    this.checkoutAvailable = this.cartService.checkAvailability(this.products);
  }

  getProducts(): void {
    this.cartService.getProducts().subscribe(
      (response) => {
        this.products = response.body!;
        this.isProductsLoaded = true;
        this.overallPrice = this.cartService.countTotalPrice(this.products);
      },
      (error) => {
        console.error(error);
        this.dialogService.openMessage(
          'Something went wrong. Reload page or log in again',
          ' Close '
        );
      }
    );
  }

  addProduct(product: ProductForCartModel) {
    const productToAdd = {
      productId: product.id,
      sizeId: product.sizeId,
      amount: 1,
    } as EditCartModel;

    if (this.cartService.isAuthorised()) {
      this.cartService.addProductToCart(productToAdd).subscribe(
        () => {
          this.loadData();
        },
        (error) => {
          if (error.status == 404) {
            this.dialogService.openMessage(
              'Product is not available anymore. Try again later',
              ' Close '
            );
          } else {
            this.dialogService.openMessage(
              'Something went wrong. Try again later',
              ' Close '
            );
          }
        }
      );
    } else {
      this.cartService.checkProduct(productToAdd).subscribe(
        () => {
          this.cartService.addProductToUnauthorizedCart(productToAdd);
          this.loadData();
        },
        (error) => {
          if (error.status == 403) {
            this.dialogService.openMessage(
              'Product is not available anymore. Try again later',
              ' Close '
            );
          } else {
            this.dialogService.openMessage(
              'Something went wrong. Try again later',
              ' Close '
            );
          }
        }
      );
    }
  }

  substractProduct(product: ProductForCartModel) {
    const productToSubstract = {
      productId: product.id,
      sizeId: product.sizeId,
      amount: 1,
    } as EditCartModel;

    if (this.cartService.isAuthorised()) {
      this.cartService.removeProductFromCart(productToSubstract).subscribe(
        () => {
          this.loadData();
        },
        () => {
          this.dialogService.openMessage(
            'Something went wrong. Try again later',
            ' Close '
          );
        }
      );
    } else {
      const productToCheck = {
        productId: product.id,
        sizeId: product.sizeId,
        amount: product.amount - 1,
      } as EditCartModel;

      this.cartService.checkProduct(productToCheck).subscribe(
        () => {
          this.cartService.removeProductFromUnauthorizedCart(
            productToSubstract
          );
          this.loadData();
        },
        (error) => {
          if (error.status == 403) {
            this.dialogService.openMessage(
              'Product is not available anymore. Try again later',
              ' Close '
            );
          } else {
            this.dialogService.openMessage(
              'Something went wrong. Try again later',
              ' Close '
            );
          }
        }
      );
    }
  }

  goToCheckout() {
    this.cartService.saveCartForCheckout(this.products);
    this.router.navigateByUrl(routeUrls.checkout);
  }
}
