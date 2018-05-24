import { Pipe, PipeTransform } from '@angular/core';

import { Address } from '@venzra/models/address';

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {
    transform(address: Address, format: string = 'short'): string {
        const offset = address.postalCode.length - 3;
        address.postalCode = address.postalCode.slice(0, offset) + ' ' + address.postalCode.slice(offset);

        switch (format) {
            case 'full':
                const fields = ['street', 'building', 'city', 'county', 'country', 'postalCode'];
                return fields.map((field) => address[field]).filter(Boolean).join(', ');
            default:
                return `${address.street}, ${address.postalCode}`;
        }
    }
}
