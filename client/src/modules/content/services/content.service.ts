import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { RestfulService } from '@venzra/services';

import { Content } from '../models/content';

@Injectable()
export class ContentService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    updateContent(usage, formData: { [key: string]: AbstractControl }): Promise<Content> {
        return this.http.patch<Content>(`/api/content/${usage}`, this.preparePatch(formData)).toPromise();
    }

    findOne(usage): Promise<Content> {
        return this.http.get<Content>(`/api/content/${usage}`).toPromise();
    }

}

@Injectable()
export class ContentRetrieveService implements Resolve<Content> {

    constructor(
        private contentService: ContentService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Content> {
        return this.contentService.findOne(route.data.usage);
    }

}
