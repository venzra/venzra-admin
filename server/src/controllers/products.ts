import { Request, Response, NextFunction, Router } from 'express';

import { AuthenticationController } from './authentication';
import { ProductModel } from '../models/products';

class ProductsController extends AuthenticationController {

    constructor(private router: Router) {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/products', this.validate.bind(this), this.findAll.bind(this));
        this.router.post('/products', this.validate.bind(this), this.createProduct.bind(this), this.findOne.bind(this));
        this.router.get('/products/:productId', this.validate.bind(this), this.findOne.bind(this));
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

    findOne(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.productId;
        const subscription = this.account.subscription._id;

        ProductModel
            .findOne({ _id, subscription })
            .select('slug code name price status')
            .then((product) => res.status(200).send(product));
    }

    findAll(req: Request, res: Response, next: NextFunction) {
        let searchParams = { subscription: this.account.subscription._id };
        let skip = 0;
        let limit = 25;

        ProductModel
            .count(searchParams).exec()
            .then((total) =>
                ProductModel
                    .aggregate([
                        { $match: searchParams },
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
