import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ActivationComponent } from './fragments/activation/activation.component';
import { LoginComponent } from './fragments/login/login.component';
import { LogoutComponent } from './fragments/logout/logout.component';
import { RecoveryComponent } from './fragments/recovery/recovery.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'activate/:account',
        component: ActivationComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'recovery',
        component: RecoveryComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AuthRoutingModule {
}
