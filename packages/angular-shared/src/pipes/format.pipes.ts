import { Pipe, type PipeTransform } from "@angular/core";
import { formatCurrency, formatDate } from "@demo/shared";

@Pipe({ name: "eur" })
export class EurPipe implements PipeTransform {
  transform(amount: number): string {
    return formatCurrency(amount);
  }
}

@Pipe({ name: "frDate" })
export class FrDatePipe implements PipeTransform {
  transform(isoDate: string): string {
    return formatDate(isoDate);
  }
}
