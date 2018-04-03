import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { Contact } from '@venzra/modules/content/models/contact';

@Injectable()
export class ContactService {

    constructor(
        private http: HttpClient
    ) { }

    createContact(contact: Contact): Promise<Contact> {
        return this.http.post<Contact>('/api/subscription/contact', contact).toPromise();
    }

}
