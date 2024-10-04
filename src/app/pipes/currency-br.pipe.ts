import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyBr',
  standalone: true
})
export class CurrencyBrPipe implements PipeTransform {

  transform(value: number): string {
    if (value !== null && value !== undefined) {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return '';
  }

}
