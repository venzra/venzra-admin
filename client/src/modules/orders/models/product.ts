import { HistoryModel } from '@venzra/models';

export interface Product {
    _id: string;
    slug: string;
    code: string;
    displayName: string;
    description: string;
    promotionalImage: string;
    previousPrice: number;
    currentPrice: number;
    history: Array<HistoryModel>;
    status: string;
    created: Date;
    updated: Date;
}
