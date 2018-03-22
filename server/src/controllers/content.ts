import * as parser from 'body-parser';

import { Request, Response, NextFunction, Router } from 'express';

import { NotFoundError } from '../middleware/error-handler';

import { AuthenticationController } from './authentication';

import { ContentModel } from '../models/content';
import { IRestOperation } from '../models/rest';

export class ContentController extends AuthenticationController {

    public router: Router;

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.json({ type: 'application/json' }));

        this.router.get('/:contentUsage', this.validate.bind(this), this.findOne.bind(this));
        this.router.patch('/:contentUsage', this.validate.bind(this), this.update.bind(this), this.findOne.bind(this));
    }

    update(req: Request, res: Response, next: NextFunction) {
        const subscription = this.account.subscription._id;
        const usage = req.params.contentUsage;

        ContentModel
            .findOne({ subscription, usage })
            .then((content) => {
                if (req.body instanceof Array === false) {
                    return;
                }

                if (!content) {
                    content = new ContentModel({ subscription, usage });
                }

                (<Array<IRestOperation>>req.body).forEach((operation) => {
                    switch (operation.op) {
                        case 'replace':
                            switch (operation.path) {
                                case 'content':
                                    content.set(operation.path, operation.value);
                                    break;
                            }
                    }
                });

                return content.save();
            })
            .then(() => next())
            .catch((error) => next(error));
    }

    findOne(req: Request, res: Response, next: NextFunction) {
        const subscription = this.account.subscription._id;
        const usage = req.params.contentUsage;

        ContentModel
            .findOne({ subscription, usage })
            .select('content usage created updated')
            .then((content) => res.status(200).send(content))
            .catch((error) => next(error));
    }

}

export default new ContentController().router;
