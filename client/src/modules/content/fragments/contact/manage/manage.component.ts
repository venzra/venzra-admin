import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Contact } from '../../../models/contact';
import { ContactService } from '../../../services/contact.service';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

@Component({
    templateUrl: './manage.component.html'
})
export class ContentContactManageComponent implements OnInit {

    public contact: Contact;
    public contactForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private contactService: ContactService
    ) { }

    ngOnInit(): void {
        this.contact = this.route.snapshot.data.subscription.contact;

        this.contactForm = this.forms.group({
            recipient: [null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            fields: [['NAME', 'EMAIL', 'MESSAGE'], []]
        });

        this.contactForm.reset(this.contact);
    }

    updateContact(): void {
        this.contactService.createContact(this.contactForm.getRawValue())
            .then(() => this.router.navigate(['/content/contact']))
            .catch((error) => this.snackbar.open(error.message || 'Update failed', 'OK', { duration: 5000 }));
    }
}
