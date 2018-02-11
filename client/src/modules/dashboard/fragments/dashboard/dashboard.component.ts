import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from '../../models/subscription';
import { ChartData } from '../../models/chart-data';
import { ListModel } from '../../../../models';
import { Statistics } from '../../models/statistics';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public subscription: Subscription;
    public orderAverages: Array<ChartData>;
    public orderVolumes: Array<ChartData>;
    public orderStates: Array<ChartData>;
    public chartSize = [420, 320];
    public colorScheme = { domain: ['#5E35B1', '#9FA8DA', '#4527A0', '#5C6BC0', '#512DA8', '#7986CB'] };

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.snapshot.data.subscription;

        this.route.data.subscribe((data: { orderVolumes: ListModel<Statistics>, orderStates: ListModel<Statistics> }) => {
            this.orderAverages = data.orderVolumes.list.map((volume) => ({ name: new Date(volume.year, volume.month - 1, volume.day), value: volume.count > 0 ? (volume.value / 100) / volume.count : 0 }));
            this.orderVolumes = data.orderVolumes.list.map((volume) => ({ name: new Date(volume.year, volume.month - 1, volume.day), value: volume.value > 0 ? volume.value / 100 : 0 }));

            const orderStates = [
                { name: 'CREATED', position: 0 },
                { name: 'AUTHORISED', position: 1 },
                { name: 'PROCESSING', position: 2 },
                { name: 'DISPATCHED', position: 3 },
                { name: 'DELIVERED', position: 4 }
            ];

            this.orderStates = data.orderStates.list.map((state) => ({ name: state.status, value: state.count })).sort((a, b) => orderStates.find((state) => state.name === a.name).position - orderStates.find((state) => state.name === b.name).position);
        });
    }

}
