export interface CategoryChild {
    _id: string;
    slug: string;
    name: string;
    description: string;
    featureImage: string;
    parent?: Category | string;
    products?: number;
    created: Date;
    updated: Date;
}

export interface Category extends CategoryChild {
    primary: boolean;
    children: CategoryChild[];
}
