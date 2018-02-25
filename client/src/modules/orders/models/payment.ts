import { Fee } from './fee';

export interface Payment {
    name: string;
    card: number;
    brand: string;
    fee: Fee;
    value: number;
    refund: number;
}
