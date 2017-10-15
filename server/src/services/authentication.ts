import { Request, Response, NextFunction } from 'express';
import { createHash, pbkdf2Sync } from 'crypto';
import { v4 } from 'uuid';
import { encode, decode } from 'jwt-simple';

import { environment } from '../config';
import { AccessDeniedError, AuthenticationError } from '../middleware/error-handler';
import { AccountModel, IAccountModel, IAccountLogin } from '../models/account';

export class Authentication {

    private accountId: string;
    private account: IAccountModel;
    private token: IAccountLogin;

    getAccount(): IAccountModel {
        return this.account;
    }

    validate(req: Request, res: Response, next: NextFunction) {
        Promise.resolve(req.cookies.jwt)
            .then((jwt) => {
                if (!jwt) {
                    throw new AccessDeniedError('No authentication token found');
                }

                return decode(jwt, environment.secret, false, 'HS512');
            })
            .then((token) => {
                if (req.ip !== token.ip) {
                    throw new AccessDeniedError('Change of IP address detected');
                }

                return token;
            })
            .then((token) =>
                AccountModel.findOne({ _id: token._id, 'access.key': token.key })
                    .then((account: IAccountModel) => {
                        if (!account) {
                            throw new AccessDeniedError(`Invalid account token for ${token._id}`);
                        }

                        // TODO: Check token expiry against account
                        this.account = account;
                        return next();
                    }))
            .catch((err) => next(err));
    }

    authorise(req: Request, res: Response, next: NextFunction) {
        if (!req.body.identity || !req.body.password) {
            return next(new AuthenticationError(null, `Missing ${req.body.identity ? 'identity' : 'password'} credential`));
        }

        AccountModel.findOne({ identity: req.body.identity })
            .then((account: IAccountModel) => {
                if (!account) {
                    throw new AuthenticationError(req.body.identity, 'Account not found');
                }

                switch (account.status) {
                    case 'ACTIVE':
                    case 'RECOVERY':
                        break;
                    case 'REGISTERED':
                        throw new AuthenticationError(account.identity, 'Account not activated');
                    case 'LOCKED':
                        // TODO: Allow for timeout on account lock for new attempts
                        throw new AuthenticationError(account.identity, 'Account locked');
                    default:
                        throw new AuthenticationError(account.identity, `Account state is ${account.status}`);
                }

                const password = pbkdf2Sync(req.body.password, account.password.salt, 10000, 256, 'sha512');

                if (account.password.secure === password.toString('base64')) {
                    this.accountId = account._id;
                    this.token = {
                        key: createHash('sha256').update(v4()).digest('hex').toString(),
                        ip: req.ip,
                        created: new Date()
                    };

                    const changes = {
                        $unset: { validation: 1 },
                        $set: {
                            access: this.token,
                            lock: { failures: 0 },
                            status: 'ACTIVE'
                        }
                    };

                    return account
                        .update(changes)
                        .exec();
                } else {
                    const changes = {
                        $unset: { access: 1 },
                        $set: {
                            'lock.ip': req.ip,
                            'lock.attempted': new Date()
                        },
                        $inc: { 'lock.failures': 1 },
                        status: (account.lock.failures >= 4 ? 'LOCKED' : account.status)
                    };

                    return account
                        .update(changes)
                        .exec()
                        .then(() => {
                            throw new AuthenticationError(account.identity, 'Password incorrect');
                        });
                }
            })
            .then(() => next())
            .catch((error) => next(error));
    }

    tokenise(req: Request, res: Response, next: NextFunction) {
        const account = {
            _id: this.accountId,
            key: this.token.key,
            ip: this.token.ip
        };
        const encoded = encode(account, environment.secret, 'HS512');

        res.cookie('jwt', encoded, { httpOnly: true, secure: environment.secure });
        res.status(200).send();
    }

    logout(req: Request, res: Response, next: NextFunction) {
        Promise.resolve()
            .then(() => this.account.update({ $unset: { access: 1 } }).exec())
            .then(() => {
                res.clearCookie('jwt');
                res.status(200).send();
            });
    }
}
