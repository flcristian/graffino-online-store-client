import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: number): string {
    let statuses: string[] = [
      "None",
      "Processing",
      "Shipping",
      "Shipped",
      "Complete"
    ]

    return statuses[value]
  }

}
