import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditProductService } from '../../store/service/edit-product/edit-product.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryColorMaterialsModel } from '../../store/models/category-color-materials.model';
import { Sizes } from '../../store/models/sizes';
import { AddProductService } from '../../store/service/add-product/add-product.service';
import { DialogService } from '../../store/service/dialog/dialog.service';
import { routeUrls } from '../../../environments/router-manager';
import { EditProduct } from '../../store/models/edit-product';
import { TokenStorageService } from '../../store/service/auth/token-storage.service';
import { ErrorPageService } from '../../store/service/error/error-page.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  title = 'Update product';
  product!: EditProduct;
  materialsList!: CategoryColorMaterialsModel[];
  categories!: CategoryColorMaterialsModel[];
  colors!: CategoryColorMaterialsModel[];
  sizesAmount!: Sizes[];
  selectedCategory!: number;
  photoFile!: File;
  productId = parseInt(this.route.snapshot.paramMap.get('id')!);

  options = {
    title: 'Do you want to delete a product?',
    message: 'This product will be permanently removed',
    cancelText: 'CANCEL',
    confirmText: 'CONTINUE',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private addProductService: AddProductService,
    private formBuilder: FormBuilder,
    private editProductService: EditProductService,
    private dialogService: DialogService,
    private tokenStorageService: TokenStorageService,
    private errorPageService: ErrorPageService
  ) {}

  editProductForm = this.formBuilder.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    productSex: ['', [Validators.required]],
    price: ['', [Validators.min(0), Validators.required]],
    discount: [0, [Validators.min(0), Validators.required]],
    description: ['', [Validators.required]],
    isAvailable: ['', [Validators.required]],
    category: ['', [Validators.required]],
    color: ['', [Validators.required]],
    materials: ['', [Validators.required]],
    sizes: [0, [Validators.min(0), Validators.required]],
  });

  private isProductManagerRole(): boolean {
    let userRole = this.tokenStorageService.getRole();
    return userRole === 'PRODUCT_MANAGER';
  }

  onSubmit() {
    this.product = this.editProductForm.value;
    this.product.sizes = this.sizesAmount;
    this.updateProduct(this.product, this.productId);
    this.dialogService.openMessage('Product has been updated', 'close');
  }

  getProduct(): void {
    this.editProductService
      .getProductById(this.productId)
      .pipe()
      .subscribe((product: EditProduct) => {
        this.product = new EditProduct(
          product.id,
          product.name,
          product.category,
          product.color,
          product.materials,
          product.productSex,
          product.price,
          product.discount,
          product.description,
          product.isAvailable,
          product.sizes
        );
        this.editProductForm.setValue(this.product);
        this.sizesAmount = product.sizes;
      });
  }

  updateProduct(product: EditProduct, productId) {
    this.editProductService.updateProductById(product, productId).subscribe();
  }

  deleteProduct(id: number) {
    this.dialogService.openConfirm(this.options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.editProductService.deleteProductById(id).subscribe(() => {
          this.dialogService.openMessage('Product has been deleted', 'close');
          this.goProductsCatalog();
        });
      }
    });
  }

  goProductsCatalog() {
    this.router.navigateByUrl(routeUrls.homepage);
  }

  compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  allMaterials() {
    this.addProductService
      .getAllMaterials()
      .pipe()
      .subscribe((materialsList: CategoryColorMaterialsModel[]) => {
        this.materialsList = materialsList;
      });
  }

  allColors() {
    this.addProductService
      .getAllColors()
      .pipe()
      .subscribe((colors: CategoryColorMaterialsModel[]) => {
        this.colors = colors;
      });
  }

  allSizes() {
    this.addProductService
      .getAllSizes()
      .pipe()
      .subscribe((sizesAmount: Sizes[]) => {
        this.sizesAmount = sizesAmount;
      });
  }

  onTrackBy(index: number) {
    return index;
  }

  allCategory() {
    this.addProductService
      .getAllCategories()
      .pipe()
      .subscribe((categories: CategoryColorMaterialsModel[]) => {
        this.categories = categories;
      });
  }

  getPhoto(event) {
    this.photoFile = event;
  }

  saveImage() {
    this.addProductService.uploadImage(this.photoFile, this.productId);
  }

  ngOnInit() {
    this.editProductForm.controls.id.disable();
    this.allMaterials();
    this.allColors();
    this.allSizes();
    this.allCategory();
    this.getProduct();
    if (!this.isProductManagerRole()) {
      this.errorPageService.openErrorPage('Access is denied');
    }
  }
}
