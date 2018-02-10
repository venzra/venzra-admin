export interface OrderStatus {
    name: string;
    position: number;
    value: 'CREATED' | 'AUTHORISED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED';
    description: string;
}
