import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ProductStateService} from "../services/product-state.service";
import {Product} from "../models/product.model";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  properties: Map<string, string[]> = new Map()

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected productState: ProductStateService,
    protected userState: CurrentUserStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.getQueryParameters()
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private getQueryParameters() {
    return this.route.queryParams.subscribe(params => {
      const queryParams = { ...params };

      const ignoredParams = ['categoryId', 'page', 'itemsPerPage', 'sort'];
      Object.keys(queryParams).forEach(key => {
        if (!ignoredParams.includes(key)) {
          this.usedProperties.set(key, queryParams[key])
        }
      });

      if (!queryParams.hasOwnProperty('page')) {
        queryParams['page'] = 1;
      }
      if (!queryParams.hasOwnProperty('itemsPerPage')) {
        queryParams['itemsPerPage'] = 12;
      }

      this.router.navigate(['products'], { queryParams });

      this.applyFilters(params)
    })
  }

  protected applyFilters(params: { [key: string]: any }) {
    const categoryId = params['categoryId'] ? +params['categoryId'] : null;
    const search = params['search'] || null;
    const page = params['page'] ? +params['page'] : null;
    const itemsPerPage = params['itemsPerPage'] ? +params['itemsPerPage'] : null;

    const properties = new Map<string, string>();

    for (const key in params) {
      if (params.hasOwnProperty(key) && !['categoryId', 'search', 'page', 'itemsPerPage'].includes(key)) {
        properties.set(key, params[key]);
      }
    }

    this.productState.filterProducts(categoryId, search, properties, page, itemsPerPage)
  }

  searchText: string = ""
  search() {
    const queryParams = { ...this.route.snapshot.queryParams };

    queryParams['search'] = this.searchText;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  sortByPriceAscending() {

  }

  sortByPriceDescending() {

  }

  sortByDateAddedAscending() {

  }

  sortByDateAddedDescending() {

  }

  clearFilters() {
    const queryParams = { ...this.route.snapshot.queryParams };

    let newQueryParams: any = {};
    newQueryParams['categoryId'] = queryParams['categoryId']
    newQueryParams['page'] = queryParams['page']
    newQueryParams['itemsPerPage'] = queryParams['itemsPerPage']

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newQueryParams
    })

    this.usedProperties = new Map();
  }

  usedProperties: Map<string, string> = new Map();
  filterProperty(name: string, value: string) {
    const queryParams = { ...this.route.snapshot.queryParams };
    this.usedProperties.set(name, value);

    queryParams[name] = value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  protected readonly Object = Object;

  isNotOlderThanThreeDays(dateAdded: Date) {
    return false
  }

  navigateToProduct(id: number) {

  }

  addToCart(id: number, product: Product) {
    this.userState.addToCart(id, product)
  }
}
