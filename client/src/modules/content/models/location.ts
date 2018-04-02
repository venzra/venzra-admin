export interface Location {
    _id: string;
    displayName: string;
    description: string;
    usage: 'business' | 'store';
    address: string;
    postalCode: string;
    featureImage: string;
    created?: Date;
    updated?: Date;
}
