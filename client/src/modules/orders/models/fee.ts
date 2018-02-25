export interface Fee {
    venzra: { amount: number, currency: string, refund: number };
    gateway: { amount: number, currency: string, refund: number };
    total: number;
}
