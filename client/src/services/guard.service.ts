import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './authentication.service';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'rxjs/add/operator/first';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const url: string = state.url;

        return this.checkLogin(url);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(childRoute, state);
    }

    canLoad(route: Route): Observable<boolean> {
        const url = `/${route.path}`;

        return this.checkLogin(url);
    }

    private checkLogin(url: string): Observable<boolean> {
        let authenticated = this.authenticationService.isAuthenticated();
        let subject = new ReplaySubject<boolean>();

        authenticated.subscribe((res) => {
            if (!res) {
                localStorage.setItem('redirect', url);
                this.router.navigate(['/auth'], { replaceUrl: true });
            }
            subject.next(res);
        });

        return subject.asObservable().first();
    }
}
