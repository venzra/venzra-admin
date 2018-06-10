import * as parser from 'body-parser';

import { Request, Response, NextFunction, Router } from 'express';
import { createHash, pbkdf2Sync } from 'crypto';
import { v4 } from 'uuid';

import { AccountAccessError, ValidationError } from '../middleware/error-handler';

import { AuthenticationController } from './authentication';

import { AccountModel, IAccountModel } from '../models/account';
import { SubscriptionModel } from '../models/subscription';
import { IAccountPassword } from '../models/objects/password';

export class IdentityController extends AuthenticationController {

    public router: Router;

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.json({ type: 'application/json' }));

        this.router.post('/login', this.authorise.bind(this), this.tokenise.bind(this));
        this.router.post('/recover', this.recover.bind(this));
        this.router.post('/activate', this.activation.bind(this));
        this.router.post('/logout', this.validate.bind(this), this.logout.bind(this));
    }

    recover(req: Request, res: Response, next: NextFunction) {
        res.status(200).send({ recovery: true });
    }

    activation(req: Request, res: Response, next: NextFunction) {
        AccountModel.findById(req.body._id)
            .then((account: IAccountModel) => {
                if (!account) {
                    throw new AccountAccessError('Account not found');
                } else if (!account.validation || req.body.token !== account.validation.key) {
                    throw new AccountAccessError('Validation key not valid');
                } else if (new Date() > new Date(account.validation.expires)) {
                    throw new AccountAccessError('Validation key expired');
                }

                return account;
            })
            .then((account: IAccountModel) => {

                const salt = createHash('sha1').update(v4()).digest('hex');

                const authorisation: IAccountPassword = {
                    salt: salt,
                    secure: pbkdf2Sync(req.body.password, salt, 10000, 256, 'sha512').toString('base64'),
                    created: new Date()
                };

                if (!account.subscription) {
                    const subscription = new SubscriptionModel();
                    account.subscription = subscription;
                }

                return account.subscription.save()
                    .then((subscription) => account.update({
                        password: authorisation,
                        lock: { failures: 0 },
                        status: 'ACTIVE',
                        subscription: subscription,
                        $unset: { validation: 1 }
                    }));
            })
            .then(() => res.status(202).send())
            .catch((error) => next(error));
    }

}

export default new IdentityController().router;
