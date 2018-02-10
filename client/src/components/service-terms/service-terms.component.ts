import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material';

@Component({
    templateUrl: './service-terms.component.html'
})
export class ServiceTermsComponent {
    constructor(
        private dialogRef: MatDialogRef<ServiceTermsComponent>
    ) { }

    confirm(): void {
        this.dialogRef.close();
    }
}
