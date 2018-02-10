import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Account, AccountService } from '../../services/account.service';

@Component({
    selector: 'venzra-admin-account',
    templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {

    public account: Account;

    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.accountService.getAccount().subscribe((account) => this.account = account);
    }

    openAccount(): void {
        this.router.navigate(['account']);
    }
}
