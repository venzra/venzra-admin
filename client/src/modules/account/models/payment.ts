import { Pricing } from './pricing';

export class Payment {
    package: string;
    customer: string;
    subscription: string;
    price: Pricing;
    term: Date;
    status: string;
}
