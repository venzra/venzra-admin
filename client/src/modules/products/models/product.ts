import { HistoryModel } from '@venzra/models';
import { Category } from './category';

export interface Product {
    _id: string;
    slug: string;
    code: string;
    displayName: string;
    description: string;
    featureImage: string;
    promotionalImage: string;
    previousPrice: number;
    currentPrice: number;
    categories: Array<Category>;
    history: Array<HistoryModel>;
    status: string;
    created: Date;
    updated: Date;
}
