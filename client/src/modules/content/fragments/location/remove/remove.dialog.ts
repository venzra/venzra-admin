import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { Location } from '../../../models/location';
import { LocationService } from '../../../services/location.service';

@Component({
    templateUrl: './remove.dialog.html'
})
export class LocationRemoveDialogComponent implements OnInit {

    public location: Location;

    constructor(
        private dialogRef: MatDialogRef<LocationRemoveDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { location: Location },
        private snackbar: MatSnackBar,
        private locationService: LocationService
    ) { }

    ngOnInit(): void {
        this.location = this.data.location;
    }

    close(): void {
        return this.dialogRef.close();
    }

    confirmRemoval(): void {
        this.locationService
            .removeLocation(this.location._id)
            .then(() => this.dialogRef.close(true))
            .catch(() => this.snackbar.open('Delete failed, please try again later', 'OK', { duration: 5000 }));
    }
}
