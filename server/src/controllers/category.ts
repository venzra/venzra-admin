import * as parser from 'body-parser';

import { Request, Response, NextFunction, Router } from 'express';

import { NotFoundError } from '../middleware/error-handler';

import { AuthenticationController } from './authentication';

import { IRestOperation } from '../models/rest';
import { CategoryModel } from '../models/category';

export class CategoryController extends AuthenticationController {

    public router: Router;

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.json({ type: 'application/json' }));

        this.router.get('/', this.validate.bind(this), this.findAll.bind(this));
        this.router.post('/', this.validate.bind(this), this.createCategory.bind(this), this.findOne.bind(this));
        this.router.get('/summary', this.validate.bind(this), this.getSummary.bind(this));
        this.router.get('/:categoryId', this.validate.bind(this), this.findOne.bind(this));
        this.router.patch('/:categoryId', this.validate.bind(this), this.updateCategory.bind(this), this.findOne.bind(this));
        this.router.delete('/:categoryId', this.validate.bind(this), this.removeOne.bind(this));
    }

    createCategory(req: Request, res: Response, next: NextFunction) {
        const category = new CategoryModel({
            subscription: this.account.subscription._id,
            name: req.body.name,
            description: req.body.description,
            primary: req.body.primary,
            featureImage: req.body.featureImage
        });

        if (req.body.parent && !req.body.primary) {
            category.parent = req.body.parent;
        }

        let promise: Promise<any> = Promise.resolve();

        if (category.parent) {
            const _id = category.parent;
            const subscription = this.account.subscription._id;

            promise = promise.then(() => CategoryModel.findOne({ _id, subscription })
                .then((parent) => {
                    if (!parent) {
                        throw new NotFoundError();
                    }

                    return category.save()
                        .then((result) => {
                            parent.children.push(result);
                            return parent.save().then(() => result);
                        });
                })
            );
        } else {
            promise = promise.then(() => category.save());
        }

        promise
            .then((result) => {
                req.params.categoryId = result._id;
                next();
            })
            .catch((error) => next(error));
    }

    updateCategory(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.categoryId;
        const subscription = this.account.subscription._id;

        CategoryModel
            .findOne({ _id, subscription })
            .populate('parent')
            .then((category) => {
                if (!category) {
                    throw new NotFoundError();
                }

                if (req.body instanceof Array === false) {
                    return;
                }

                let promise: Promise<any> = Promise.resolve();

                (<Array<IRestOperation>>req.body).forEach((operation) => {
                    switch (operation.op) {
                        case 'replace':
                            switch (operation.path) {
                                case 'primary':
                                    if (!category.parent) {
                                        promise = promise.then(() => category.set(operation.path, operation.value));
                                    }
                                    break;
                                case 'parent':
                                    if (category.children.length === 0) {
                                        promise = promise
                                            .then(() => CategoryModel
                                                .findOne({ _id: operation.value, subscription: subscription })
                                                .then((parent) => {
                                                    if (!parent) {
                                                        throw new NotFoundError();
                                                    }
                                                    return parent.update({ $addToSet: { children: category._id } });
                                                })
                                            )
                                            .then(() => {
                                                if (category.parent) {
                                                    const parent = category.parent;
                                                    return parent.update({ $pull: { children: category._id } });
                                                }
                                            })
                                            .then(() => category.set(operation.path, operation.value));
                                    }
                                    break;
                                case 'name':
                                case 'description':
                                case 'featureImage':
                                    promise = promise.then(() => category.set(operation.path, operation.value));
                            }
                    }
                });

                return promise.then(() => category.save());
            })
            .then(() => next())
            .catch((error) => next(error));
    }

    removeOne(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.categoryId;
        const subscription = this.account.subscription._id;

        CategoryModel.findOne({ _id, subscription })
            .then((category) => {
                if (!category) {
                    throw new NotFoundError();
                }

                if (category.parent) {
                    return CategoryModel.findOneAndUpdate({ _id: category.parent, subscription }, { $pull: { children: category._id } }).then(() => category);
                } else if (category.children.length) {
                    return Promise.all(category.children.map((child) => CategoryModel.findOneAndUpdate({ _id: child, subscription }, { $unset: { parent: 1 } }))).then(() => category);
                } else {
                    return category;
                }
            })
            .then((category) => category.remove())
            .then(() => res.status(202).send())
            .catch((error) => next(error));
    }

    findOne(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.categoryId;
        const subscription = this.account.subscription._id;

        CategoryModel
            .findOne({ _id, subscription })
            .select('slug name description featureImage parent primary created updated')
            .populate({
                path: 'parent',
                select: 'slug name featureImage primary created updated'
            })
            .populate({
                path: 'children',
                select: 'slug name featureImage primary created updated'
            })
            .populate({
                path: 'products',
                select: '_id code displayName promotionalImage status created updated'
            })
            .then((category) => category ? res.status(200).send(category) : next(new NotFoundError()))
            .catch((error) => next(error));
    }

    findAll(req: Request, res: Response, next: NextFunction) {
        const searchParams: any = { subscription: this.account.subscription._id };
        const skip = parseInt(req.query.skip, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 20;
        let order = {};

        if (req.query.search) {
            searchParams.name = new RegExp(req.query.search, 'i');
        }

        if (req.query.parent) {
            searchParams.parent = { $eq: null };
        }

        switch (req.query.sort) {
            case 'name':
            case 'created':
                order[req.query.sort] = (req.query.direction === 'desc') ? -1 : 1;
                break;
            default:
                order = { name: req.query.direction === 'desc' ? -1 : 1 };
        }

        CategoryModel
            .count(searchParams).exec()
            .then((total) =>
                CategoryModel
                    .aggregate([
                        { $match: searchParams },
                        { $sort: order },
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { slug: 1, name: 1, featureImage: 1, primary: 1, parent: 1, children: { $size: { '$ifNull': ['$children', []] } }, products: { $size: { '$ifNull': ['$products', []] } }, created: 1 } }
                    ])
                    .then((list) => res.status(200).send({ list, total, skip, limit }))
            )
            .catch((error) => next(error));
    }

    getSummary(req: Request, res: Response, next: NextFunction) {
        const searchParams = { subscription: this.account.subscription._id, parent: { $eq: null } };

        CategoryModel.find(searchParams)
            .select('_id name')
            .populate({
                path: 'children',
                select: '_id name',
                options: { sort: { name: 1 } }
            })
            .sort({ name: 1 })
            .then((categories) => res.status(200).send({ list: categories }))
            .catch((error) => next(error));
    }

}

export default new CategoryController().router;
