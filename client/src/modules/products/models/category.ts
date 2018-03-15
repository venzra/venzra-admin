export interface CategoryChild {
    _id: string;
    name: string;
}

export interface Category extends CategoryChild {
    children: CategoryChild[];
}
