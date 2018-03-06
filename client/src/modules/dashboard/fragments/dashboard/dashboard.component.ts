import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material';

import * as shape from 'd3-shape';

import { ListModel } from '@venzra/models';
import { NonePipe } from '@venzra/filters/none.pipe';
import { PricePipe } from '@venzra/filters/price.pipe';

import { ChartData } from '../../models/chart-data';
import { Highlights } from '../../models/highlights';
import { Overview } from '../../models/overview';
import { Statistics } from '../../models/statistics';
import { Subscription } from '../../models/subscription';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    public subscription: Subscription;
    public actions: Overview;
    public hasAction = false;
    public highlights: Array<ChartData> = [];
    public orderAverages: Array<ChartData> = [];
    public orderVolumes: Array<ChartData> = [];
    public orderStates: Array<ChartData> = [];
    public lineCurve = shape.curveMonotoneX;
    public colorScheme = { domain: ['#5E35B1', '#9FA8DA', '#4527A0', '#5C6BC0', '#512DA8', '#7986CB'] };

    @ViewChild(MatStepper) stepper: MatStepper;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.snapshot.data.subscription;

        const highlights = <Highlights> this.route.snapshot.data.highlights;

        this.actions = {
            products: !!highlights.products,
            shipping: !!highlights.shipping,
            gateway: !!this.subscription.gateway
        };
        this.hasAction = Object.keys(this.actions).filter((key) => !this.actions[key]).length > 0;
    }

    ngAfterViewInit(): void {
        setTimeout(_ => this.loadCharts());
    }

    loadCharts() {
        if (this.stepper) {
            let currentStep = -1;
            this.stepper._steps.forEach((step, idx) => {
                if (!step.completed && currentStep < 0) {
                    currentStep = idx;
                }
            });
            this.stepper.selectedIndex = currentStep;
        }

        this.route.data.subscribe((data: { highlights: Highlights, orderVolumes: ListModel<Statistics>, orderStates: ListModel<Statistics> }) => {
            this.highlights = [
                { name: 'Total Visitors', value: data.highlights.visitors },
                { name: 'Abandoned Carts', value: data.highlights.carts },
                { name: 'Orders', value: data.highlights.orders },
                { name: 'Net Sales', value: data.highlights.turnover, extra: { format: 'price' } }
            ];

            this.orderAverages = data.orderVolumes.list.map((volume) => ({ name: new Date(volume.year, volume.month - 1, volume.day), value: volume.count > 0 ? (volume.value - volume.refund) / volume.count : 0 }));
            this.orderVolumes = data.orderVolumes.list.map((volume) => ({ name: new Date(volume.year, volume.month - 1, volume.day), value: volume.value - volume.refund }));

            const orderStates = [
                { name: 'CREATED', position: 0 },
                { name: 'AUTHORISED', position: 1 },
                { name: 'PROCESSING', position: 2 },
                { name: 'DISPATCHED', position: 3 },
                { name: 'DELIVERED', position: 4 },
                { name: 'REFUNDED', position: 5 }
            ];

            this.orderStates = data.orderStates.list.map((state) => ({ name: state.status, value: state.count })).sort((a, b) => orderStates.find((state) => state.name === a.name).position - orderStates.find((state) => state.name === b.name).position);
        });
    }

    formatAxis(label: any) {
        if (label === 0) {
            return '';
        }
        return new PricePipe().transform(label);
    }

    formatLabel(item: any) {
        return `<p class="mat-body-2">${item.label}</p><p class="mat-caption">Last 30 days</p>`;
    }

    formatValue(item: any) {
        switch (item.data.extra ? item.data.extra.format : '') {
            case 'price':
                return new NonePipe().transform(new PricePipe().transform(item.value, undefined, 0));
            default:
                return item.value;
        }
    }

    getDomain() {
        return `https://${this.subscription.storeName.replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-').toLowerCase()}.venzra.io`;
    }

}
