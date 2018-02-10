import { Gateway } from './gateway';
import { Payment } from './payment';

export class Subscription {
    _id: string;
    gateway: Gateway;
    payment: Payment;
    status: string;
    created: Date;
    updated: Date;
}
