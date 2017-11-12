import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/toPromise';

export class Account {
    _id?: string;
    identity: string;
    status?: string;
    subscription?: string;
}

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

    private accountUri = 'api/v1/account';
    private activationUri = 'api/v1/identity/activate';
    private loginUri = 'api/v1/identity/login';
    private logoutUri = 'api/v1/identity/logout';
    private recoveryUri = 'api/v1/identity/recovery';

    public userAccount: Account;

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
            .then(() => delete this.userAccount)
            .then(() => localStorage.clear())
            .then(() => this.router.navigate(['/auth'], { replaceUrl: true }));
    }

    performRecovery(forgottenData: Recovery): Promise<any> {
        return this.http.post(this.recoveryUri, forgottenData, { responseType: 'text' })
            .toPromise();
    }

    isAuthenticated(): Observable<boolean> {
        let subject = new BehaviorSubject<boolean>(true);

        if (this.userAccount) {
            subject.next(true);
        } else if (localStorage.getItem('authenticated') === '1') {
            this.http.get(this.accountUri)
                .subscribe((account) => {
                    this.userAccount = account as Account;
                    subject.next(true);
                }, () => {
                    subject.next(false);
                });
        } else {
            subject.next(false);
        }

        return subject.asObservable();
    }
}
