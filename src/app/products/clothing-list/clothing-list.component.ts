import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ProductStateService} from "../services/product-state.service";
import {Clothing} from "../models/clothing.model";

@Component({
  selector: 'app-clothing-list',
  templateUrl: './clothing-list.component.html'
})
export class ClothingListComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription()

  constructor(
    protected state: ProductStateService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.getClothing()
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  private getClothing() {
    return this.state.getAllClothing().subscribe({
      next: (clothing: Clothing[]) => {
        this.state.setClothing(clothing)
      },
      error: (error) => {
        this.state.setError(error)
      },
      complete: () => {
        this.state.setLoading(false)
      }
    })
  }
}
