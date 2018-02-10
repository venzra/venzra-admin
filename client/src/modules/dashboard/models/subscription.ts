import { Payment } from './payment';
import { Transaction } from './transaction';

export interface Subscription {
    _id: string;
    storeName: string;
    strapline: string;
    payment: Payment;
    transactions: Transaction;
    status: string;
    created: Date;
    updated: Date;
}
