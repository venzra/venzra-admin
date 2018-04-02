import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ListModel } from '@venzra/models';

import { Content } from '../../models/content';
import { Location } from '../../models/location';
import { AddonService } from '../../services/addon.service';
import { LocationService } from '../../services/location.service';
import { ContentService } from '../../services/content.service';

import { LocationRemoveDialogComponent } from './remove/remove.dialog';

@Component({
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss'],
    providers: [AddonService]
})
export class ContentLocationComponent implements OnInit {

    public content: Content;
    public contentForm: FormGroup;
    public locations: ListModel<Location>;
    public locationsOpen = false;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private router: Router,
        private dialog: MatDialog,
        private addonService: AddonService,
        private locationService: LocationService,
        private contentService: ContentService
    ) { }

    ngOnInit(): void {
        this.locations = this.route.snapshot.data.locations;
        this.content = this.route.snapshot.data.content;
        const enabled = !!this.route.snapshot.data.subscription.addons.find((addon) => addon.name === 'LOCATION');

        this.contentForm = this.forms.group({
            enabled: [false, []],
            content: [this.content ? this.content.content : null, []]
        });

        this.contentForm.get('enabled').valueChanges.subscribe((value) => {
            const validators = [Validators.maxLength(5000)];

            if (value) {
                validators.push(Validators.required);
            }

            this.contentForm.get('content').setValidators(validators);
        });

        this.contentForm.get('enabled').setValue(enabled);
    }

    removeLocation(event: Event, location: Location) {
        event.stopPropagation();
        const dialogRef = this.dialog.open(LocationRemoveDialogComponent, { width: '90%', maxWidth: '640px', disableClose: true, data: { location } });
        dialogRef.afterClosed().subscribe((reload = false) => reload ? this.locationService.findAll().then((locations) => this.locations = locations) : null);
    }

    saveContent(): void {
        this.addonService
            .updateAddons('LOCATION', this.contentForm.get('enabled').value)
            .then(() => this.contentService.updateContent('LOCATION', this.contentForm.controls))
            .then(() => this.router.navigate(['/content']));
    }
}
