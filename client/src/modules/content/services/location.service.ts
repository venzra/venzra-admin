import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { RestfulService } from '@venzra/services';
import { ListModel } from '@venzra/models';

import { Location } from '../models/location';

@Injectable()
export class LocationService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    createLocation(location: Location): Promise<Location> {
        return this.http.post<Location>('/api/locations', location).toPromise();
    }

    updateLocation(locationId: string, formData: { [key: string]: AbstractControl }): Promise<Location> {
        return this.http.patch<Location>(`/api/locations/${locationId}`, this.preparePatch(formData)).toPromise();
    }

    removeLocation(locationId: string): Promise<boolean> {
        return this.http.delete<boolean>(`/api/locations/${locationId}`).toPromise();
    }

    findOne(locationId: string): Promise<Location> {
        return this.http.get<Location>(`/api/locations/${locationId}`).toPromise();
    }

    findAll(): Promise<ListModel<Location>> {
        return this.http.get<ListModel<Location>>('/api/locations').toPromise();
    }

}

@Injectable()
export class LocationRetrieveResolve implements Resolve<Location> {

    constructor(
        private locationService: LocationService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Location> {
        return this.locationService.findOne(route.params.locationId);
    }

}

@Injectable()
export class LocationListResolve implements Resolve<ListModel<Location>> {

    constructor(
        private locationService: LocationService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Location>> {
        return this.locationService.findAll();
    }

}
