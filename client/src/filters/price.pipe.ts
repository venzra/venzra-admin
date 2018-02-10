import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
    transform(price: number, currency: string = 'gbp'): string {
        if (price === 0) {
            return 'FREE';
        }

        let prefix = '£';

        switch (currency) {
            case 'eur':
                prefix = '€';
                break;
            case 'usd':
                prefix = '$';
                break;
        }

        price /= 100;

        const formatted = (price || 0).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').replace(/\.00$/, '');
        return `${prefix}${formatted}`.trim();
    }
}
