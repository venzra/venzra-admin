import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { Career } from '../../../models/career';
import { CareerService } from '../../../services/career.service';

@Component({
    templateUrl: './remove.dialog.html'
})
export class RemoveCareerDialogComponent implements OnInit {

    public career: Career;

    constructor(
        private dialogRef: MatDialogRef<RemoveCareerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { career: Career },
        private snackbar: MatSnackBar,
        private careerService: CareerService
    ) { }

    ngOnInit(): void {
        this.career = this.data.career;
    }

    close(): void {
        return this.dialogRef.close();
    }

    confirmRemoval(): void {
        this.careerService
            .removeCareer(this.career._id)
            .then(() => this.dialogRef.close(true))
            .catch(() => this.snackbar.open('Delete failed, please try again later', 'OK', { duration: 5000 }));
    }
}
