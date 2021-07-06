import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductForCartModel } from '../models/product-for-cart.model';
import { endpointUrls } from '../../../environments/endpoint-routes-manager';
import { environment } from '../../../environments/environment';
import { EditCartModel } from '../models/edit-cart.model';
import { TokenStorageService } from './auth/token-storage.service';
import { sessionStorageKeys } from '../../../environments/session-storage-manager';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  getCartUrl = `${environment.url}${endpointUrls.apiPrefix}${endpointUrls.getCart}`;
  addProductUrl =
    environment.url + endpointUrls.apiPrefix + endpointUrls.addProduct;
  removeProductUrl =
    environment.url + endpointUrls.apiPrefix + endpointUrls.deleteProduct;
  checkProductUrl =
    environment.url + endpointUrls.apiPrefix + endpointUrls.checkProduct;
  getUnauthorizedCartUrl =
    environment.url + endpointUrls.apiPrefix + endpointUrls.getUnauthorizedCart;

  CART_KEY = sessionStorageKeys.CART_KEY;

  private httpOptions = { observe: 'response' as const };

  private unauthorizedCart: ProductForCartModel[] | undefined;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getProducts(): Observable<HttpResponse<ProductForCartModel[]>> {
    if (this.tokenStorageService.isAuthorised()) {
      return this.http.get<ProductForCartModel[]>(
        this.getCartUrl,
        this.httpOptions
      );
    } else {
      const unauthorizedCart = this.getUnauthorizedCart();
      return this.http.post<ProductForCartModel[]>(
        this.getUnauthorizedCartUrl,
        unauthorizedCart,
        this.httpOptions
      );
    }
  }

  addProductToCart(data: EditCartModel): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.addProductUrl, data, this.httpOptions);
  }

  removeProductFromCart(data: EditCartModel): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.removeProductUrl, data, this.httpOptions);
  }

  checkProduct(data: EditCartModel): Observable<HttpResponse<any>> {
    return this.http.post(this.checkProductUrl, data, this.httpOptions);
  }

  addProductToUnauthorizedCart(productToAdd: EditCartModel): void {
    const cart = this.getUnauthorizedCart();
    let isInCart = false;
    for (let product of cart) {
      if (
        product.productId == productToAdd.productId &&
        product.sizeId == productToAdd.sizeId
      ) {
        product.amount += productToAdd.amount;
        isInCart = true;
      }
    }
    if (!isInCart) {
      cart.push(productToAdd);
    }
    this.saveUnauthorizedCart(cart);
    console.log(cart.toString());
  }

  removeProductFromUnauthorizedCart(productToRemove: EditCartModel): void {
    const cart = this.getUnauthorizedCart();
    cart.forEach((product, index) => {
      if (
        product.productId == productToRemove.productId &&
        product.sizeId == productToRemove.sizeId
      ) {
        if (product.amount == 1) {
          cart.splice(index, 1);
        } else {
          product.amount -= productToRemove.amount;
        }
      }
    });
    this.saveUnauthorizedCart(cart);
  }

  getUnauthorizedCart(): EditCartModel[] {
    const result = JSON.parse(<string>sessionStorage.getItem(this.CART_KEY));
    if (result == null) {
      return [];
    }
    return result;
  }

  saveUnauthorizedCart(cart: EditCartModel[]): void {
    sessionStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  countTotalPrice(products: ProductForCartModel[]): number {
    let total = 0;
    for (let product of products) {
      total += product.overallPrice;
    }
    return total;
  }

  isAuthorised(): boolean {
    return this.tokenStorageService.isAuthorised();
  }

  checkAvailability(products: ProductForCartModel[]): boolean {
    let unavailableCounter = 0;
    for (let product of products) {
      unavailableCounter += product.unavailableAmount;
    }
    return unavailableCounter === 0;
  }

  saveCartForCheckout(wholeCart: ProductForCartModel[]): void {
    this.unauthorizedCart = wholeCart;
  }
}
