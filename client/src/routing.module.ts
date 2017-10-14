import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/guard.service';
import { PrivateComponent } from './private.component';
import { PublicComponent } from './public.component';

const routes: Routes = [
    {
        path: 'auth',
        component: PublicComponent,
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: 'account',
        component: PrivateComponent,
        loadChildren: './account/account.module#AccountModule',
        canLoad: [AuthGuard]
    },
    {
        path: 'errors',
        component: PublicComponent,
        loadChildren: './errors/errors.module#ErrorsModule'
    },
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/errors/404'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard
    ]
})
export class VenzraRoutingModule {
}
