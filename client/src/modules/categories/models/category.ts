import { VenzraImage } from '@venzra/models';

import { Product } from './product';

export interface CategoryChild {
    _id: string;
    slug: string;
    name: string;
    description: string;
    featureImage: VenzraImage;
    parent?: Category | string;
    products?: Product[];
    created: Date;
    updated: Date;
}

export interface Category extends CategoryChild {
    primary: boolean;
    children: CategoryChild[];
}
