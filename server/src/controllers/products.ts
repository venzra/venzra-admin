import { Request, Response, NextFunction, Router } from 'express';

import { AuthenticationController } from './authentication';

import { ProductModel } from '../models/products';
import { ProductHistoryModel } from '../models/history';
import { IRestOperation } from '../models/rest';
import { NotFoundError } from '../middleware/error-handler';

class ProductsController extends AuthenticationController {

    constructor(private router: Router) {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/products', this.validate.bind(this), this.findAll.bind(this));
        this.router.post('/products', this.validate.bind(this), this.createProduct.bind(this), this.findOne.bind(this));
        this.router.get('/products/:productId', this.validate.bind(this), this.findOne.bind(this));
        this.router.patch('/products/:productId', this.validate.bind(this), this.updateProduct.bind(this), this.findOne.bind(this));
    }

    createProduct(req: Request, res: Response, next: NextFunction) {
        const product = new ProductModel({
            subscription: this.account.subscription._id,
            code: req.body.code,
            displayName: req.body.displayName,
            previousPrice: req.body.previousPrice,
            currentPrice: req.body.currentPrice
        });

        product.save()
            .then((result) => {
                req.params.productId = result._id;
                next();
            })
            .catch((productError) => next(productError));
    }

    updateProduct(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.productId;
        const subscription = this.account.subscription._id;

        ProductModel
            .findOne({ _id, subscription })
            .populate({
                path: 'history'
            })
            .then((product) => {
                if (!product) {
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
                                case 'previousPrice':
                                case 'currentPrice':
                                case 'status':
                                    const history = new ProductHistoryModel({ account: this.account._id, table: 'products', field: operation.path, previous: product.get(operation.path), next: operation.value });
                                    promise = promise
                                        .then(() => history.save())
                                        .then((history) => product.history.unshift(history));
                                // falls-through
                                case 'displayName':
                                    promise = promise
                                        .then(() => product.set(operation.path, operation.value));
                            }
                    }
                });

                return promise.then(() => product.save());
            })
            .then(() => next())
            .catch((error) => next(error));
    }

    findOne(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.productId;
        const subscription = this.account.subscription._id;

        ProductModel
            .findOne({ _id, subscription })
            .select('slug code displayName previousPrice currentPrice status created updated')
            .populate({
                path: 'history',
                select: '-_id -table -__v',
                populate: {
                    path: 'account',
                    select: 'identity'
                }
            })
            .then((product) => res.status(200).send(product));
    }

    findAll(req: Request, res: Response, next: NextFunction) {
        const searchParams: any = { subscription: this.account.subscription._id };
        const skip = parseInt(req.query.skip, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 25;
        const order = { displayName: 1 };

        if (req.query.search) {
            searchParams.displayName = new RegExp(req.query.search, 'i');
        }

        ProductModel
            .count(searchParams).exec()
            .then((total) =>
                ProductModel
                    .aggregate([
                        { $match: searchParams },
                        { $sort: order },
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { slug: 1, code: 1, displayName: 1, currentPrice: 1, status: 1 } }
                    ])
                    .then((list) => res.status(200).send({ list, total, skip, limit }))
            )
            .catch((productError) => next(productError));
    }

}

export { ProductsController };
