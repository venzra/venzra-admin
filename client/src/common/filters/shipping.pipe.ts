import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shipping' })
export class ShippingPipe implements PipeTransform {
    transform(time: number): string {
        return `${time} hours`;
    }
}
