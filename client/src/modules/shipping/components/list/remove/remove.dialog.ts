import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Shipping, ShippingService } from '../../../services/shipping.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './remove.dialog.html'
})
export class RemoveShippingDialogComponent implements OnInit {

    public shipping: Shipping;
    public removalForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private dialogRef: MatDialogRef<RemoveShippingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { shipping: Shipping },
        private snackbar: MatSnackBar,
        private shippingService: ShippingService
    ) { }

    ngOnInit(): void {
        this.shipping = this.data.shipping;

        const verification = new RegExp(`^${this.shipping.displayName}$`);

        this.removalForm = this.forms.group({
            confirm: ['', [Validators.required, Validators.pattern(verification)]]
        });
    }

    close(): void {
        return this.dialogRef.close();
    }

    confirmRemoval(): void {
        this.shippingService
            .removeShipping(this.shipping._id)
            .then(() => this.dialogRef.close(true))
            .catch(() => this.snackbar.open('Delete failed, please try again later', 'OK', { duration: 5000 }));
    }
}
