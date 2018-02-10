import { Pricing } from './pricing';

export interface Payment {
    package: string;
    customer: string;
    subscription: string;
    price: Pricing;
    term: Date;
    status: string;
}
