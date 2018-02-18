import { Payment } from './payment';
import { Gateway } from './gateway';
import { Transaction } from './transaction';

export interface Subscription {
    _id: string;
    storeName: string;
    strapline: string;
    payment: Payment;
    gateway: Gateway;
    transactions: Transaction;
    status: string;
    created: Date;
    updated: Date;
}
