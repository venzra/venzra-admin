import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatStepperModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PageModule } from '@venzra/components/page/page.module';
import { FiltersModule } from '@venzra/filters/filters.module';

import { AccountRoutingModule } from './routing.module';

import { GatewayComponent } from './fragments/gateway/gateway.component';
import { SubscriptionComponent } from './fragments/subscription/subscription.component';

@NgModule({
    declarations: [
        GatewayComponent,
        SubscriptionComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        MatStepperModule,
        MatTooltipModule,
        FlexLayoutModule,
        AccountRoutingModule,
        PageModule,
        FiltersModule
    ]
})
export class AccountModule {
}
