import { HistoryModel } from 'models';

import { Address } from './address';
import { Customer } from './customer';
import { Item } from './item';
import { Payment } from './payment';
import { Shipping } from './shipping';

export interface Order {
    _id: string;
    customer: Customer;
    reference: string;
    items: Array<Item>;
    shipping: Shipping;
    destination: Address;
    billing: Address;
    payment: Payment;
    history: Array<HistoryModel>;
    status?: string;
    created?: Date;
    updated?: Date;
}
