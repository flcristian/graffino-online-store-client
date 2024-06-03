import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductsStateService} from "../../products/services/products-state.service";
import {CreateProductRequest} from "../../products/models/create-product-request.model";
import {UpdateProductRequest} from "../../products/models/update-product-request.model";
import {Token} from "../../users/models/token.model";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {Subscription} from "rxjs";
import {Category} from "../../products/models/category.model";
import {Product} from "../../products/models/product.model";
import {ConfirmPopup} from "primeng/confirmpopup";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-products-manager',
  templateUrl: './products-manager.component.html'
})
export class ProductsManagerComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  createProductForm: FormGroup = new FormGroup({});
  token: Token | null = null;
  tableSelectedCategory: Category | null = null;
  createProductSelectedCategory: Category | null = null;

  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  constructor(
    private fb: FormBuilder,
    protected productState: ProductsStateService,
    private userState: CurrentUserStateService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.token = this.userState.getToken()

    this.subscriptions.add(
      this.getCategories()
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private getCategories() {
    return this.productState.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.productState.setCategories(categories)
      },
      error: (error) => {
        this.productState.setErrorCategories(error)
      },
      complete: () => {
        this.productState.setLoadingCategories(false)
      }
    })
  }

  initializeForms(): void {
    this.initializeCreateProductForm()
  }

  initializeCreateProductForm() {
    this.createProductForm = this.fb.group({
      name: ["", Validators.required],
      price: ["", Validators.required],
      imageUrl: ["", Validators.required],
      productProperties: this.fb.array([])
    });
  }

  updateSelectedCategory() {
    this.productState.filterProducts(this.tableSelectedCategory!.id, null, null, null, null, null);
  }

  updateCreatePropertiesPropertiesFormGroup(): void {
    if(this.createProductSelectedCategory) {
      Object.keys(this.createProductForm.controls).forEach(key => {
        if (key !== 'name' && key !== 'price' && key !== 'categoryId' && key !== 'imageUrl') {
          this.createProductForm.removeControl(key);
        }
      });

      if (this.createProductSelectedCategory && this.createProductSelectedCategory.properties) {
        this.createProductSelectedCategory.properties.forEach(property => {
          this.createProductForm.addControl(property.name, this.fb.control("", Validators.required));
        });
      }
    }
  }

  createProduct() {
    if (this.createProductForm.invalid || !this.token) {
      return;
    }

    const request: CreateProductRequest = {
      name: this.createProductForm.value.name,
      price: this.createProductForm.value.price,
      categoryId: this.createProductSelectedCategory?.id as number,
      imageUrl: this.createProductForm.value.imageUrl,
      productProperties: []
    };

    for(let i = 0; i < this.createProductSelectedCategory!.properties.length; i++) {
      request.productProperties.push({
        propertyId: this.createProductSelectedCategory!.properties[i].id,
        value: this.createProductForm.get(this.createProductSelectedCategory!.properties[i].name)!.value
      })
    }

    this.productState.createProduct(request, this.token)
    this.initializeCreateProductForm()
    this.updateCreatePropertiesPropertiesFormGroup()
  }

  updateProduct(product: Product) {
    if (!this.token) {
      return;
    }

    const request: UpdateProductRequest = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      productProperties: product.productProperties
    };

    this.productState.updateProduct(request, this.token);
  }

  onRowEditSave(product: Product) {
    this.updateProduct(product)
  }

  calculateColumnWidth() {
    return 84 / (4 + this.tableSelectedCategory!.properties.length);
  }

  accept() {
    this.confirmPopup.accept();
  }

  reject() {
    this.confirmPopup.reject();
  }

  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this product?',
      accept: () => {
        this.deleteProduct(id);
      },
      reject: () => { }
    });
  }

  deleteProduct(id: number) {
    if (!this.token) {
      return;
    }

    this.productState.deleteProduct(id, this.token);
  }
}
