import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Token} from "../../users/models/token.model";
import {Category} from "../../products/models/category.model";
import {ProductsStateService} from "../../products/services/products-state.service";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {CreateCategoryRequest} from "../../products/models/create-category-request.model";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmPopup} from "primeng/confirmpopup";

@Component({
  selector: 'app-categories-manager',
  templateUrl: './categories-manager.component.html'
})
export class CategoriesManagerComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  createCategoryForm: FormGroup = new FormGroup({});
  categoryProperties: string[] = [];
  token: Token | null = null;

  @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

  constructor(
    private fb: FormBuilder,
    protected productState: ProductsStateService,
    private userState: CurrentUserStateService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
  }

  initializeCreateCategoryForm() {
    this.createCategoryForm = this.fb.group({
      name: ["", Validators.required],
      properties: this.fb.array([])
    });
    this.categoryProperties = []
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

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to create this category?',
      accept: () => {
        this.createCategory()
      },
      reject: () => { }
    });
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

  accept() {
    this.confirmPopup.accept();
  }

  reject() {
    this.confirmPopup.reject();
  }
}
