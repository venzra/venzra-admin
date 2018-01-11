import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Account, AccountService } from './services/account.service';
import { ServiceTermsComponent } from './common/components/service-terms/service-terms.component';

@Component({
    templateUrl: './private.component.html',
    styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {

    public account: Account;

    constructor(
        private accountService: AccountService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.accountService.getAccount().subscribe((account) => this.account = account);
    }

    viewServiceAgreement() {
        this.dialog.open(ServiceTermsComponent, { width: '640px' });
    }

}
