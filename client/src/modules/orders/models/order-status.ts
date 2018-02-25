export interface OrderStatus {
    name: string;
    position: number;
    value: 'CREATED' | 'AUTHORISED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'REFUNDED';
    description: string;
    disable?: boolean;
}
