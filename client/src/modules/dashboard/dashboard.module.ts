import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatIconModule, MatStepperModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BarChartModule, LineChartModule, NumberCardModule } from '@swimlane/ngx-charts';

import { DashboardRoutingModule } from './routing.module';

import { PageModule } from 'components/page/page.module';

import { DashboardComponent } from './fragments/dashboard/dashboard.component';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatStepperModule,
        FlexLayoutModule,
        DashboardRoutingModule,
        BarChartModule,
        LineChartModule,
        NumberCardModule,
        PageModule
    ]
})
export class DashboardModule {
}
