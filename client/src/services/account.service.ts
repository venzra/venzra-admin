import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/toPromise';

export interface Account {
    _id?: string;
    identity: string;
    status?: string;
    subscription?: string;
}

export interface AccountCredentials {
    identity: string;
    password: string;
}

export interface Activation {
    _id: string;
    password: string;
    token: string;
    terms: boolean;
}

export interface PasswordStrength {
    score: number;
    message: string;
}

export interface Recovery {
    identity: string;
}

@Injectable()
export class AccountService {

    private account: BehaviorSubject<Account> = new BehaviorSubject({ identity: null });

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    activateAccount(activationData: Activation): Promise<any> {
        return this.http.post('/api/identity/activate', activationData, { responseType: 'text' })
            .toPromise();
    }

    getAccount(): BehaviorSubject<Account> {
        return this.account;
    }

    validatePassword(password: string): Promise<PasswordStrength> {
        return this.http.post('/api/validation/password', { password })
            .toPromise()
            .then((result) => result as PasswordStrength)
            .catch(() => ({ score: 0, message: 'Validation not currently available' }));
    }

    performLogin(credentialData: AccountCredentials): Promise<boolean> {
        const redirect = localStorage.getItem('redirect') || '/account';

        return this.http.post('/api/identity/login', credentialData, { responseType: 'text' })
            .toPromise()
            .then(() => localStorage.setItem('authenticated', '1'))
            .then(() => localStorage.removeItem('redirect'))
            .then(() => this.router.navigate([redirect], { replaceUrl: true }));
    }

    performRecovery(forgottenData: Recovery): Promise<any> {
        return this.http.post('/api/identity/recovery', forgottenData, { responseType: 'text' })
            .toPromise();
    }

    performLogout(): Promise<boolean> {
        return this.http.post('/api/identity/logout', null, { responseType: 'text' })
            .toPromise()
            .catch(() => null)
            .then(() => localStorage.clear())
            .then(() => this.router.navigate(['/auth'], { replaceUrl: true }));
    }

    isAuthenticated(): Observable<boolean> {
        const subject = new BehaviorSubject<boolean>(true);

        if (localStorage.getItem('authenticated') === '1') {
            this.http.get('/api/account')
                .subscribe((account: Account) => {
                    this.account.next(account);
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
