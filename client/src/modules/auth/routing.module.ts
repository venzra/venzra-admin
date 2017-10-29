import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ActivationComponent } from './components/activation/activation.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RecoveryComponent } from './components/recovery/recovery.component';

const routes: Routes = [
    { path: 'activate/:account', component: ActivationComponent },
    { path: 'recovery', component: RecoveryComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '', component: LoginComponent }
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
