import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
    template: `
      <h2>Logging out</h2>
      <p>Please wait a moment while you are logged out....</p>
    `
})
export class LogoutComponent implements OnInit {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit(): void {
        this.authenticationService.performLogout();
    }
}
