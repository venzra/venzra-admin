import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ListModel } from '@venzra/models';

import { Career } from '../../models/career';
import { Content } from '../../models/content';
import { AddonService } from '../../services/addon.service';
import { CareerService } from '../../services/career.service';
import { ContentService } from '../../services/content.service';

import { CareerRemoveDialogComponent } from './remove/remove.dialog';

@Component({
    templateUrl: './careers.component.html',
    styleUrls: ['./careers.component.scss'],
    providers: [AddonService]
})
export class ContentCareersComponent implements OnInit {

    public careers: ListModel<Career>;
    public content: Content;
    public contentForm: FormGroup;
    public currentDate = new Date();
    public positionsOpen = false;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private router: Router,
        private dialog: MatDialog,
        private addonService: AddonService,
        private careerService: CareerService,
        private contentService: ContentService
    ) { }

    ngOnInit(): void {
        this.careers = this.route.snapshot.data.careers;
        this.content = this.route.snapshot.data.content;
        const enabled = !!this.route.snapshot.data.subscription.addons.find((addon) => addon.name === 'CAREERS');

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

    hasExpired(career: Career) {
        return new Date(career.expires) < this.currentDate;
    }

    removeCareer(event: Event, career: Career) {
        event.stopPropagation();
        const dialogRef = this.dialog.open(CareerRemoveDialogComponent, { width: '90%', maxWidth: '640px', disableClose: true, data: { career } });
        dialogRef.afterClosed().subscribe((reload = false) => reload ? this.careerService.findAll().then((careers) => this.careers = careers) : null);
    }

    saveContent(): void {
        this.addonService
            .updateAddons('CAREERS', this.contentForm.get('enabled').value)
            .then(() => this.contentService.updateContent('CAREERS', this.contentForm.controls))
            .then(() => this.router.navigate(['/content']));
    }
}
