import { Component } from '@angular/core';

import { LayoutService } from '@venzra/services';

@Component({
    templateUrl: './forgotten-confirmation.component.html',
    styleUrls: ['./forgotten-confirmation.component.scss']
})
export class ForgottenConfirmationComponent {

    constructor(
        private layout: LayoutService
    ) {
        this.layout.title = 'Forgotten password';
    }

}
