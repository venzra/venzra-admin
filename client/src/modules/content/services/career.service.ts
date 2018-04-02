import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { RestfulService } from '@venzra/services';
import { ListModel } from '@venzra/models';

import { Career } from '../models/career';

@Injectable()
export class CareerService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    createCareer(career: Career): Promise<Career> {
        return this.http.post<Career>('/api/careers', career).toPromise();
    }

    updateCareer(careerId: string, formData: { [key: string]: AbstractControl }): Promise<Career> {
        return this.http.patch<Career>(`/api/careers/${careerId}`, this.preparePatch(formData)).toPromise();
    }

    removeCareer(careerId: string): Promise<boolean> {
        return this.http.delete<boolean>(`/api/careers/${careerId}`).toPromise();
    }

    findOne(careerId: string): Promise<Career> {
        return this.http.get<Career>(`/api/careers/${careerId}`).toPromise();
    }

    findAll(): Promise<ListModel<Career>> {
        return this.http.get<ListModel<Career>>('/api/careers').toPromise();
    }

}

@Injectable()
export class CareerRetrieveResolve implements Resolve<Career> {

    constructor(
        private careerService: CareerService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Career> {
        return this.careerService.findOne(route.params.careerId);
    }

}

@Injectable()
export class CareerListResolve implements Resolve<ListModel<Career>> {

    constructor(
        private careerService: CareerService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Career>> {
        return this.careerService.findAll();
    }

}
