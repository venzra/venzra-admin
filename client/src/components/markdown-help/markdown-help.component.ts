import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    templateUrl: './markdown-help.component.html'
})
export class MarkdownHelpComponent {
    constructor(
        private dialogRef: MatDialogRef<MarkdownHelpComponent>
    ) { }

    close(): void {
        this.dialogRef.close();
    }
}
