import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { Category } from '../../..//models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
    templateUrl: './remove.dialog.html'
})
export class RemoveCategoryDialogComponent implements OnInit {

    public category: Category;
    public removalForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private dialogRef: MatDialogRef<RemoveCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { category: Category },
        private snackbar: MatSnackBar,
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.category = this.data.category;

        const verification = new RegExp(`^${this.category.name}$`);

        this.removalForm = this.forms.group({
            confirm: ['', [Validators.required, Validators.pattern(verification)]]
        });
    }

    close(): void {
        return this.dialogRef.close();
    }

    confirmRemoval(): void {
        this.categoryService
            .removeCategory(this.category._id)
            .then(() => this.dialogRef.close(true))
            .catch(() => this.snackbar.open('Delete failed, please try again later', 'OK', { duration: 5000 }));
    }
}
