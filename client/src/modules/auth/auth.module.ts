import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { AuthRoutingModule } from './routing.module';

import { ActivationComponent } from './components/activation/activation.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RecoveryComponent } from './components/recovery/recovery.component';

import { AccountService } from '../../services/account.service';

@NgModule({
    declarations: [
        ActivationComponent,
        LoginComponent,
        LogoutComponent,
        RecoveryComponent
    ],
    imports: [
        CommonModule,
        VenzraCommonModule,
        AuthRoutingModule
    ],
    providers: [
        AccountService
    ]
})
export class AuthModule {
}
