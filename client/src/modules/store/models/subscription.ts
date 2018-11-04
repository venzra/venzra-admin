export interface Subscription {
    _id: string;
    storeName: string;
    strapline: string;
    additionalDomains: Array<string>;
    icon: string;
    logo: string;
    theme: { color: string };
    status: string;
    created: Date;
    updated: Date;
}
