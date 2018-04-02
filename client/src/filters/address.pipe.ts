import { Pipe, PipeTransform } from '@angular/core';

import { Address } from '@venzra/models/address';

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {
    transform(address: Address, format: string = 'short'): string {
        switch (format) {
            case 'full':
                return Object.values(address).join(', ');
            default:
                return `${address.street}, ${address.postalCode}`;
        }
    }
}
