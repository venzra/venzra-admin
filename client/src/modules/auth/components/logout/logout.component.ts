import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../../../services/account.service';

@Component({
    template: `
      <h2>Logging out</h2>
      <p>Please wait a moment while you are logged out....</p>
    `
})
export class LogoutComponent implements OnInit {
    constructor(
        private accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.accountService.performLogout();
    }
}
