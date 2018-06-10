import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';

import { Account, AccountService } from '../../services/account.service';

@Component({
    templateUrl: './private.component.html',
    styleUrls: ['./private.component.scss'],
    providers: [MediaMatcher]
})
export class PrivateComponent implements OnInit, OnDestroy {

    public account: Account;
    public mobileQuery: MediaQueryList;
    private mobileQueryListener: () => void;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private dialog: MatDialog,
        private accountService: AccountService
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 960px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
    }

    ngOnInit(): void {
        this.accountService.getAccount().subscribe((account) => this.account = account);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

}
