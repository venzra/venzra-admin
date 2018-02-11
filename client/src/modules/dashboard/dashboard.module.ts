import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatIconModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BarChartModule, LineChartModule } from '@swimlane/ngx-charts';

import { DashboardRoutingModule } from './routing.module';

import { PageModule } from 'components/page/page.module';

import { DashboardComponent } from './fragments/dashboard/dashboard.component';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        FlexLayoutModule,
        DashboardRoutingModule,
        BarChartModule,
        LineChartModule,
        PageModule
    ]
})
export class DashboardModule {
}
