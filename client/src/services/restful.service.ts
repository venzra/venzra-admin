import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class RestfulService {

    preparePatch(formData: { [key: string]: AbstractControl }) {
        const operations = [];

        Object.keys(formData).forEach((key: string) => {
            const field = formData[key];

            if (field.dirty) {
                operations.push({ op: 'replace', path: key, value: field.value });
            }
        });

        return operations;
    }

}
