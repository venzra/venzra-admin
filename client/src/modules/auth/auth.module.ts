import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthRoutingModule } from './routing.module';

import { AccountService } from 'services';

import { ActivationComponent } from './fragments/activation/activation.component';
import { LoginComponent } from './fragments/login/login.component';
import { LogoutComponent } from './fragments/logout/logout.component';
import { RecoveryComponent } from './fragments/recovery/recovery.component';

@NgModule({
    declarations: [
        ActivationComponent,
        LoginComponent,
        LogoutComponent,
        RecoveryComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatInputModule,
        MatSnackBarModule,
        MatTooltipModule,
        FlexLayoutModule,
        AuthRoutingModule
    ],
    providers: [
        AccountService
    ]
})
export class AuthModule {
}
