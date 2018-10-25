import * as parser from 'body-parser';

import { Request, Response, NextFunction, Router } from 'express';

import { AuthenticationController } from './authentication';

import { NotFoundError } from '../middleware/error-handler';
import { LocationModel } from '../models/locations';
import { IRestOperation } from '../models/rest';
import { ImageModel } from '../models/images';

export class LocationController extends AuthenticationController {

    public router: Router;

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.json({ type: 'application/json' }));

        this.router.get('/', this.validate.bind(this), this.findAll.bind(this));
        this.router.post('/', this.validate.bind(this), this.createLocation.bind(this), this.findOne.bind(this));
        this.router.get('/:locationId', this.validate.bind(this), this.findOne.bind(this));
        this.router.patch('/:locationId', this.validate.bind(this), this.updateLocation.bind(this), this.findOne.bind(this));
        this.router.delete('/:locationId', this.validate.bind(this), this.removeOne.bind(this));
    }

    createLocation(req: Request, res: Response, next: NextFunction) {
        const location = new LocationModel({
            subscription: this.account.subscription._id,
            displayName: req.body.displayName,
            description: req.body.description,
            address: req.body.address,
            featureImage: req.body.featureImage,
            usage: req.body.usage
        });

        location.save()
            .then((result) => {
                req.params.locationId = result._id;
                next();
            })
            .catch((error) => next(error));
    }

    updateLocation(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.locationId;
        const subscription = this.account.subscription._id;

        LocationModel
            .findOne({ _id, subscription })
            .then((location) => {
                if (!location) {
                    throw new NotFoundError();
                }

                if (req.body instanceof Array === false) {
                    return;
                }

                (<Array<IRestOperation>>req.body).forEach((operation) => {
                    switch (operation.op) {
                        case 'replace':
                            switch (operation.path) {
                                case 'displayName':
                                case 'description':
                                case 'address':
                                case 'featureImage':
                                case 'usage':
                                    location.set(operation.path, operation.value);
                                    break;
                            }
                    }
                });

                return location.save();
            })
            .then(() => next())
            .catch((error) => next(error));
    }

    removeOne(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.locationId;
        const subscription = this.account.subscription._id;

        LocationModel.findOneAndRemove({ _id, subscription })
            .then((result) => {
                if (!result) {
                    throw new NotFoundError();
                }
                res.status(202).send();
            })
            .catch((error) => next(error));
    }

    findOne(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.locationId;
        const subscription = this.account.subscription._id;

        LocationModel
            .findOne({ _id, subscription })
            .select('displayName description address featureImage usage created updated')
            .populate({
                path: 'featureImage',
                select: '_id name usage path'
            })
            .then((content) => {
                if (!content) {
                    throw new NotFoundError();
                }
                res.status(200).send(content);
            })
            .catch((error) => next(error));
    }

    findAll(req: Request, res: Response, next: NextFunction) {
        const searchParams = { subscription: this.account.subscription._id };
        const order = { displayName: 1 };

        LocationModel
            .count(searchParams).exec()
            .then((total) =>
                LocationModel
                    .aggregate([
                        { $match: searchParams },
                        { $sort: order },
                        { $project: { displayName: 1, address: 1, featureImage: 1, usage: 1, created: 1 } }
                    ])
                    .then((result) => ImageModel.populate(result, {
                        path: 'featureImage',
                        select: '_id name usage path'
                    }))
                    .then((list) => res.status(200).send({ list, total }))
            )
            .catch((error) => next(error));
    }

}

export default new LocationController().router;
