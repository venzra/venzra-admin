import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Content } from '../../models/content';
import { ContentService } from '../../services/content.service';

import { defaultTerms } from './default';

@Component({
    templateUrl: './terms.component.html'
})
export class ContentTermsComponent implements OnInit {

    public content: Content;
    public contentForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private router: Router,
        private contentService: ContentService
    ) { }

    ngOnInit(): void {
        this.content = this.route.snapshot.data.content;

        this.contentForm = this.forms.group({
            enabled: [{ value: true, disabled: true }, [Validators.requiredTrue]],
            content: [this.content ? this.content.content : defaultTerms.trim(), [Validators.required, Validators.maxLength(20000)]]
        });
    }

    saveContent(): void {
        this.contentService.updateContent('TERMS', this.contentForm.controls)
            .then(() => this.router.navigate(['/content']));
    }
}
