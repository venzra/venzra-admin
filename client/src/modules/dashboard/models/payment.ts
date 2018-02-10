export interface Payment {
    package: string;
    price: { currency: string; quantity: number; value: number; };
    term: Date;
    status: string;
}
