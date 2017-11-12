import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
    transform(price: number): string {
        const formatted = price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/\.00$/, '');
        return `£ ${formatted}`.trim();
    }
}
