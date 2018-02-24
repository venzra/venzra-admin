import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'none' })
export class NonePipe implements PipeTransform {

    transform(value: any): string {
        switch (value) {
            case 0:
            case 'FREE':
                return 'NONE';
            default:
                return value;
        }
    }

}
