import { Request, Response, NextFunction, Router } from 'express';

import { AuthenticationController } from './authentication';

import { ProductModel } from '../models/products';
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
        let product = new ProductModel({
            subscription: this.account.subscription._id,
            code: req.body.code,
            name: req.body.name,
            price: req.body.price
        });

        product.save()
            .then((product) => {
                req.params.productId = product._id;
                next();
            })
            .catch((productError) => next(productError));
    }

    updateProduct(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.productId;
        const subscription = this.account.subscription._id;

        ProductModel
            .findOne({ _id, subscription })
            .then((product) => {
                if (!product) {
                    throw new NotFoundError();
                }

                if (req.body instanceof Array === false) {
                    return;
                }

                (<Array<IRestOperation>>req.body).forEach((operation) => {
                    switch (operation.op) {
                        case 'replace':
                            switch (operation.path) {
                                case 'price':
                                case 'status':
                                    product.history.push({ account: this.account._id, field: operation.path, previous: product.get(operation.path), next: operation.value });
                                    // falls-through
                                case 'name':
                                    product.set(operation.path, operation.value);
                            }
                    }
                });

                return product.save();
            })
            .then(() => next())
            .catch((error) => next(error));
    }

    findOne(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.productId;
        const subscription = this.account.subscription._id;

        ProductModel
            .findOne({ _id, subscription })
            .select('slug code name price history status')
            .then((product) => res.status(200).send(product));
    }

    findAll(req: Request, res: Response, next: NextFunction) {
        let searchParams: any = { subscription: this.account.subscription._id };
        let skip = parseInt(req.query.skip) || 0;
        let limit = parseInt(req.query.limit) || 25;
        let order = { name: 1 };

        if (req.query.search) {
            searchParams.name = new RegExp(req.query.search, 'i');
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
                        { $project: { slug: 1, code: 1, name: 1, price: 1, status: 1 } }
                    ])
                    .then((list) => res.status(200).send({ list, total, skip, limit }))
            )
            .catch((productError) => next(productError));
    }

}

export { ProductsController };
