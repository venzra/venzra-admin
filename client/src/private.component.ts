import { Component } from '@angular/core';

import { Account, AuthenticationService } from './services/authentication.service';

@Component({
    selector: 'app-private',
    templateUrl: './private.component.html'
})
export class PrivateComponent {

    public account: Account;

    constructor(
        private authenticationService: AuthenticationService
    ) {
        this.account = authenticationService.userAccount;
    }
}
