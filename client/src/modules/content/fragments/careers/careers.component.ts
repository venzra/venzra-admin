import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Content } from '../../models/content';
import { AddonService } from '../../services/addon.service';
import { ContentService } from '../../services/content.service';

@Component({
    templateUrl: './careers.component.html',
    providers: [AddonService]
})
export class ContentCareersComponent implements OnInit {

    public content: Content;
    public contentForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private router: Router,
        private addonService: AddonService,
        private contentService: ContentService
    ) { }

    ngOnInit(): void {
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

    saveContent(): void {
        this.addonService
            .updateAddons('CAREERS', this.contentForm.get('enabled').value)
            .then(() => this.contentService.updateContent('CAREERS', this.contentForm.controls))
            .then(() => this.router.navigate(['/content']));
    }
}
