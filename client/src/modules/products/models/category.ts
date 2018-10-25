export interface CategoryChild {
    _id: string;
    name: string;
}

export interface Category extends CategoryChild {
    parent: Category;
    children: CategoryChild[];
}
