import * as parser from 'body-parser';

import { NextFunction, Request, Response, Router } from 'express';

import { AuthenticationController } from './authentication';
import { OrderModel } from '../models/orders';

export class StatisticsController extends AuthenticationController {

    public router: Router;

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.json({ type: 'application/json' }));
        this.router.get('/orders/volume', this.validate.bind(this), this.orderVolume.bind(this));
        this.router.get('/orders/status', this.validate.bind(this), this.orderStatus.bind(this));
    }

    orderVolume(req: Request, res: Response, next: NextFunction) {
        const subscription = this.account.subscription._id;
        const numberOfDays = 30;
        const startDate = new Date((new Date().getTime() - ((numberOfDays - 1) * 24 * 60 * 60 * 1000)));

        OrderModel
            .aggregate([
                { $match: { subscription, created: { $gte: startDate } } },
                {
                    $group: {
                        _id: { year: { $year: '$created' }, month: { $month: '$created' }, day: { $dayOfMonth: '$created' } },
                        count: { $sum: 1 },
                        value: { $sum: '$payment.value' }
                    }
                },
                {
                    $sort: {
                        '_id.year': 1,
                        '_id.month': 1,
                        '_id.day': 1
                    }
                },
                { $project: { _id: 0, year: '$_id.year', month: '$_id.month', day: '$_id.day', count: 1, value: 1 } }
            ])
            .then((result) => {
                const orderVolumes = [];
                if (result.length > 0) {
                    for (let i = 0; i < numberOfDays; i++) {
                        const nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
                        const data = result.find((entry) => entry.year === nextDate.getFullYear() && entry.month === (nextDate.getMonth() + 1) && entry.day === nextDate.getDate());

                        if (data) {
                            orderVolumes.push(data);
                        } else {
                            orderVolumes.push({ year: nextDate.getFullYear(), month: nextDate.getMonth() + 1, day: nextDate.getDate(), value: 0, count: 0 });
                        }
                    }
                }
                res.status(200).send({ list: orderVolumes, total: orderVolumes.length });
            })
            .catch((error) => next(error));
    }

    orderStatus(req: Request, res: Response, next: NextFunction) {
        const subscription = this.account.subscription._id;

        OrderModel
            .aggregate([
                { $match: { subscription, status: { $ne: 'DELIVERED' } } },
                {
                    $group: {
                        _id: { status: '$status' },
                        count: { $sum: 1 },
                        value: { $sum: '$payment.value' }
                    }
                },
                {
                    $sort: {
                        '_id.status': 1
                    }
                },
                { $project: { _id: 0, status: '$_id.status', count: 1, value: 1 } }
            ])
            .then((result) => res.status(200).send({ list: result, total: result.length }))
            .catch((error) => next(error));
    }

}

export default new StatisticsController().router;
