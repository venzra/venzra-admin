import * as parser from 'body-parser';

import { Request, Response, NextFunction, Router } from 'express';

import { NotFoundError } from '../middleware/error-handler';

import { AuthenticationController } from './authentication';

import { ProductModel } from '../models/products';
import { ProductHistoryModel } from '../models/product-history';
import { IRestOperation } from '../models/rest';

export class ProductsController extends AuthenticationController {

    public router: Router;

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.json({ type: 'application/json' }));

        this.router.get('/', this.validate.bind(this), this.findAll.bind(this));
        this.router.post('/', this.validate.bind(this), this.createProduct.bind(this), this.findOne.bind(this));
        this.router.get('/:productId', this.validate.bind(this), this.findOne.bind(this));
        this.router.patch('/:productId', this.validate.bind(this), this.updateProduct.bind(this), this.findOne.bind(this));
    }

    createProduct(req: Request, res: Response, next: NextFunction) {
        const product = new ProductModel({
            subscription: this.account.subscription._id,
            code: req.body.code,
            displayName: req.body.displayName,
            description: req.body.description,
            featureImage: req.body.featureImage,
            promotionalImage: req.body.promotionalImage,
            previousPrice: req.body.previousPrice,
            currentPrice: req.body.currentPrice,
            status: req.body.status
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
                                    const history = new ProductHistoryModel({ account: this.account._id, field: operation.path, previous: product.get(operation.path), next: operation.value });
                                    promise = promise
                                        .then(() => history.save())
                                        .then(() => product.history.unshift(history));
                                /* falls through */
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
            .select('slug code displayName description featureImage promotionalImage previousPrice currentPrice status created updated')
            .populate({
                path: 'history',
                select: '-_id -table -__v',
                populate: {
                    path: 'account',
                    select: 'identity'
                }
            })
            .then((product) => product ? res.status(200).send(product) : next(new NotFoundError()));
    }

    findAll(req: Request, res: Response, next: NextFunction) {
        const searchParams: any = { subscription: this.account.subscription._id };
        const skip = parseInt(req.query.skip, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 20;
        let order = {};

        if (req.query.search) {
            searchParams.code = new RegExp(req.query.search, 'i');
        }

        if (req.query.status) {
            searchParams.status = req.query.status.toUpperCase();
        }

        switch (req.query.sort) {
            case 'displayName':
            case 'currentPrice':
                order[req.query.sort] = (req.query.direction === 'desc') ? -1 : 1;
                break;
            default:
                order = { created: req.query.direction === 'asc' ? 1 : -1 };
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
                        { $project: { slug: 1, code: 1, displayName: 1, promotionalImage: 1, currentPrice: 1, status: 1, created: 1 } }
                    ])
                    .then((list) => res.status(200).send({ list, total, skip, limit }))
            )
            .catch((productError) => next(productError));
    }

}

export default new ProductsController().router;
