import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Product} from "../models/product.model";
import {CurrentUserStateService} from "../../users/services/current-user-state.service";
import {Category} from "../models/category.model";
import {ProductsStateService} from "../services/products-state.service";
import {ExchangeRateService} from "../../utlity/exchange-rate.service";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()
  selectedCategory: number = 1;
  currentPage: number = 1;
  totalPages: number = 1;
  categories: Category[] = []
  currency: string = "EUR"
  exchangeRateRON: number = 5
  exchangeRateUSD: number = 1

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected productState: ProductsStateService,
    protected userState: CurrentUserStateService,
    private exchangeRate: ExchangeRateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.getQueryParameters()
    )

    this.subscriptions.add(
      this.getAllCategories()
    )

    this.subscriptions.add(
      this.productState.state$.subscribe(data => {
        if(data.totalPages) {
          this.totalPages = data.totalPages
        }
      })
    )

    this.currency = this.userState.getCurrency()

    this.subscriptions.add(
      this.exchangeRate.getExchangeRate().subscribe(data => {
        this.exchangeRateRON = data.rates.RON
        this.exchangeRateUSD = data.rates.USD
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private getAllCategories() {
    return this.productState.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories
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

  private getQueryParameters() {
    return this.route.queryParams.subscribe(params => {
      const queryParams = { ...params };

      const ignoredParams = ['categoryId', 'page', 'itemsPerPage', 'sort'];
      Object.keys(queryParams).forEach(key => {
        if (!ignoredParams.includes(key)) {
          this.usedProperties.set(key, queryParams[key])
        }
      });

      if(!queryParams.hasOwnProperty('categoryId')) {
        queryParams['categoryId'] = 1;
      } else {
        this.selectedCategory = Number(queryParams['categoryId'])
      }
      if (!queryParams.hasOwnProperty('page')) {
        queryParams['page'] = 1;
      } else {
        this.currentPage = queryParams['page']
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
    const sort = params['sort'] || null

    const properties = new Map<string, string>();

    for (const key in params) {
      if (params.hasOwnProperty(key) && !['categoryId', 'search', 'page', 'itemsPerPage'].includes(key)) {
        properties.set(key, params[key]);
      }
    }

    this.productState.filterProducts(categoryId, search, properties, page, itemsPerPage, sort)
  }

  selectCategory(categoryId: number) {
    let newQueryParams: any = {};
    newQueryParams['categoryId'] = categoryId
    newQueryParams['page'] = 1
    newQueryParams['itemsPerPage'] = 12

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newQueryParams
    })

    this.usedProperties = new Map()
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
    const queryParams = { ...this.route.snapshot.queryParams };

    queryParams['sort'] = "priceasc";

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  sortByPriceDescending() {
    const queryParams = { ...this.route.snapshot.queryParams };

    queryParams['sort'] = "pricedesc";

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  sortByDateAddedAscending() {
    const queryParams = { ...this.route.snapshot.queryParams };

    queryParams['sort'] = "dateasc";

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  sortByDateAddedDescending() {
    const queryParams = { ...this.route.snapshot.queryParams };

    queryParams['sort'] = "datedesc";

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
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
    if(this.usedProperties.get(name) === value) {
      this.usedProperties.delete(name)
      queryParams[name] = null;
    }
    else
    {
      this.usedProperties.set(name, value);
      queryParams[name] = value;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  protected readonly Object = Object;

  isNotOlderThanThreeDays(dateAdded: Date) {
    const currentDate = new Date();
    const date = new Date(dateAdded);
    const timeDifference = currentDate.getTime() - date.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference <= 3;
  }

  getProductPrice(price: number) {
    if(this.currency === "RON") return price * this.exchangeRateRON
    if(this.currency === "USD") return price * this.exchangeRateUSD
    return price
  }

  navigateToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  addToCart(product: Product) {
    this.userState.addToCart(product)
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page
    const queryParams = { ...this.route.snapshot.queryParams, page: page };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  protected readonly Number = Number;
}
