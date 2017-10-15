import { Request, Response, NextFunction, Router } from 'express';
import { createHash, pbkdf2Sync } from 'crypto';
import { v4 } from 'uuid';
import { encode, decode } from 'jwt-simple';

import { AccountAccessError } from '../middleware/error-handler';

import { AccountModel, IAccountModel, IAccountPassword } from '../models/account';

import { Authentication } from '../services/authentication';

class IdentityController extends Authentication {

    constructor(private router: Router) {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/identity/login', this.authorise.bind(this), this.tokenise.bind(this));
        this.router.post('/identity/recover', this.recover.bind(this));
        this.router.post('/identity/activate', this.activation.bind(this));
        this.router.post('/identity/logout', this.validate.bind(this), this.logout.bind(this));
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

                return account.update({
                    status: 'ACTIVE',
                    password: authorisation,
                    $unset: { validation: 1 }
                });
            })
            .then(() => res.status(202).send())
            .catch((error) => next(error));
    }

}

export { IdentityController };
