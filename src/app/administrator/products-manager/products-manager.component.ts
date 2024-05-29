import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductsStateService} from "../../products/services/products-state.service";
import {CreateCategoryRequest} from "../../products/models/create-category-request.model";
import {CreateProductRequest} from "../../products/models/create-product-request.model";
import {UpdateProductRequest} from "../../products/models/update-product-request.model";
import {Token} from "../../users/models/token.model";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {Subscription} from "rxjs";
import {Category} from "../../products/models/category.model";
import {Product} from "../../products/models/product.model";

@Component({
  selector: 'app-products-manager',
  templateUrl: './products-manager.component.html'
})
export class ProductsManagerComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  createCategoryForm: FormGroup = new FormGroup({});
  createProductForm: FormGroup = new FormGroup({});
  updateProductForm: FormGroup = new FormGroup({});
  categoryProperties: string[] = [];
  token: Token | null = null;
  selectedCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    protected productState: ProductsStateService,
    private userState: CurrentUserStateService
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
    this.initializeCreateCategoryForm()
    this.initializeCreateProductForm()
    this.initializeUpdateProductForm()
  }

  initializeCreateCategoryForm() {
    this.createCategoryForm = this.fb.group({
      name: ["", Validators.required],
      properties: this.fb.array([])
    });
  }

  initializeCreateProductForm() {
    this.createProductForm = this.fb.group({
      name: ["", Validators.required],
      price: ["", Validators.required],
      imageUrl: ["", Validators.required],
      productProperties: this.fb.array([])
    });
  }

  initializeUpdateProductForm() {
    this.updateProductForm = this.fb.group({
      id: ["", Validators.required],
      name: ["", Validators.required],
      price: ["", Validators.required],
      imageUrl: ["", Validators.required],
      productProperties: this.fb.array([])
    });
  }

  addProperty(): void {
    const propertiesArray = this.createCategoryForm.get('properties') as FormArray;
    const controlName = `property${propertiesArray.length}`;
    propertiesArray.push(this.fb.control("", Validators.required));
    this.categoryProperties.push(controlName);
  }

  removeProperty(index: number): void {
    const propertiesArray = this.createCategoryForm.get('properties') as FormArray;
    if (index >= 0 && index < propertiesArray.length) {
      propertiesArray.removeAt(index);
      this.categoryProperties.splice(index, 1);
    }
  }

  createCategory() {
    if (this.createCategoryForm.invalid || !this.token) {
      return;
    }

    const request: CreateCategoryRequest = {
      name: this.createCategoryForm.value.name,
      properties: []
    };

    for(let i = 0; i < this.createCategoryForm.value.properties.length; i++) {
      request.properties.push({
        name: this.createCategoryForm.value.properties[i]
      })
    }

    this.productState.createCategory(request, this.token);
    this.initializeCreateCategoryForm()
  }

  updateSelectedCategory() {
    this.productState.filterProducts(this.selectedCategory!.id, null, null, null, null, null);
  }

  updateCreatePropertiesPropertiesFormGroup(): void {
    if(this.selectedCategory) {
      Object.keys(this.createProductForm.controls).forEach(key => {
        if (key !== 'name' && key !== 'price' && key !== 'categoryId' && key !== 'imageUrl') {
          this.createProductForm.removeControl(key);
        }
      });

      if (this.selectedCategory && this.selectedCategory.properties) {
        this.selectedCategory.properties.forEach(property => {
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
      categoryId: this.selectedCategory?.id as number,
      imageUrl: this.createProductForm.value.imageUrl,
      productProperties: []
    };

    for(let i = 0; i < this.selectedCategory!.properties.length; i++) {
      request.productProperties.push({
        propertyId: this.selectedCategory!.properties[i].id,
        value: this.createProductForm.get(this.selectedCategory!.properties[i].name)!.value
      })
    }

    this.productState.createProduct(request, this.token)
    this.initializeCreateProductForm()
    this.updateCreatePropertiesPropertiesFormGroup()
  }

  updateProduct() {
    if (this.updateProductForm.invalid || !this.token) {
      return;
    }

    const request: UpdateProductRequest = {
      id: this.updateProductForm.value.id,
      name: this.updateProductForm.value.name,
      price: this.updateProductForm.value.price,
      imageUrl: this.updateProductForm.value.imageUrl,
      productProperties: this.updateProductForm.value.productProperties
    };

    this.productState.updateProduct(request, this.token);
    this.initializeUpdateProductForm()
  }

  onRowEditSave(product: Product) {
  }

  calculateColumnWidth() {
    return 92 / (4 + this.selectedCategory!.properties.length);
  }
}
