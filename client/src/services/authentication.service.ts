import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

export class Activation {
    _id: string;
    password: string;
    token: string;
}

export class Authentication {
    identity: string;
    password: string;
}

export class Recovery {
    identity: string;
}

@Injectable()
export class AuthenticationService {

    private activationUri = 'api/v1/identity/activate';
    private loginUri = 'api/v1/identity/login';
    private logoutUri = 'api/v1/identity/logout';
    private recoveryUri = 'api/v1/identity/recovery';

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    activateAccount(activationData: Activation): Promise<any> {
        return this.http.post(this.activationUri, activationData, { responseType: 'text' })
            .toPromise();
    }

    performLogin(identityData: Authentication): Promise<boolean> {
        const redirect = localStorage.getItem('redirect') || '/account';

        return this.http.post(this.loginUri, identityData, { responseType: 'text' })
            .toPromise()
            .then(() => localStorage.setItem('authenticated', '1'))
            .then(() => localStorage.removeItem('redirect'))
            .then(() => this.router.navigate([redirect], { replaceUrl: true }));
    }

    performLogout(): Promise<boolean> {
        return this.http.post(this.logoutUri, null, { responseType: 'text' })
            .toPromise()
            .catch(() => null)
            .then(() => localStorage.clear())
            .then(() => this.router.navigate(['/auth'], { replaceUrl: true }));
    }

    performRecovery(forgottenData: Recovery): Promise<any> {
        return this.http.post(this.recoveryUri, forgottenData, { responseType: 'text' })
            .toPromise();
    }
}
