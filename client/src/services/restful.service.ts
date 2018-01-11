import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export class ListModel<T> {
    list: Array<T>;
    skip: number;
    limit: number;
    total: number;
}

export class HistoryModel {
    account: any;
    field: string;
    previous: string;
    next: string;
    updated: Date;
}

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
