import { Component, OnInit } from '@angular/core';

import { Account, AccountService } from './services/account.service';

@Component({
    selector: 'app-private',
    templateUrl: './private.component.html'
})
export class PrivateComponent implements OnInit {

    public account: Account;

    constructor(
        private accountService: AccountService
    ) {
    }

    ngOnInit(): void {
        this.accountService.getAccount().subscribe((account) => this.account = account);
    }

}
