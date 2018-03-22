import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subscription } from '../models/subscription';

@Injectable()
export class AddonService {

    constructor(
        private http: HttpClient
    ) { }

    updateAddons(name, operation): Promise<Subscription> {
        return this.http.patch<Subscription>('/api/subscription/add-ons', [{ op: operation ? 'add' : 'remove', path: 'name', value: name }]).toPromise();
    }

}
