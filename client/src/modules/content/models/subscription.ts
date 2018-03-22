import { Addon } from './addon';

export interface Subscription {
    _id: string;
    addons: Array<Addon>;
    status: string;
    created: Date;
    updated: Date;
}
