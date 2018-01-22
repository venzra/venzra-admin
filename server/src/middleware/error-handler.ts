import { Request, Response, NextFunction } from 'express';

import * as winston from 'winston';

interface IVenzraError {
    name?: string;
    code?: number;
    account?: string;
    message: string;
    reason?: string;
    errors?: any;
    limit?: number;
    length?: number;
}

class VenzraError extends Error {
    constructor(public message: string) {
        super();
        this.name = this.constructor.name;
    }
}

export class AccountAccessError extends VenzraError implements IVenzraError {
    constructor(public reason: string) {
        super('Invalid account credentials');
    }
}

export class AccessDeniedError extends VenzraError implements IVenzraError {
    constructor(public reason: string) {
        super('Access Denied');
    }
}

export class AuthenticationError extends VenzraError implements IVenzraError {
    constructor(public account: string, public reason: string) {
        super('Invalid user credentials');
    }
}

export class ValidationError extends VenzraError implements IVenzraError {
    constructor(public errors: Array<any>) {
        super('Validation failed');
    }
}

export class NotFoundError extends VenzraError implements IVenzraError {
    constructor() {
        super('Resource not found');
    }
}

export class ThirdPartyError extends VenzraError implements IVenzraError {
    constructor(public name: string, public reason: string) {
        super(`An external error has occurred - ${name}`);
    }
}

export const errorHandler = (err: IVenzraError, req: Request, res: Response, next: NextFunction): void => {
    const logger: winston.LoggerInstance = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                timestamp: () => Date.now(),
                formatter: (options) => `${req.ip} - ERROR LOG - [${new Date(options.timestamp()).toISOString()}] - "${req.method} ${req.originalUrl}" ${options.level.toUpperCase()} "${options.message}"`
            })
        ]
    });

    switch (err.name) {
        case 'AccountAccessError':
            logger.info(err.reason);
            res.status(400).send({ message: err.message });
            break;
        case 'ValidationError':
            logger.info(err.message);
            const detail = new Set();
            for (const key of Object.keys(err.errors)) {
                detail.add(`${err.errors[key].path} ${err.errors[key].kind}`.trim());
            }
            res.status(400).send({ message: 'Validation failed', detail: [...detail] });
            break;
        case 'AuthenticationError':
            logger.info(`${err.reason} for ${err.account || 'unknown'}`);
            res.clearCookie('jwt');
            res.status(400).send({ message: err.message });
            break;
        case 'AccessDeniedError':
            logger.info(err.reason);
            res.clearCookie('jwt');
            res.status(401).send({ message: err.message });
            break;
        case 'StripeSignatureVerificationError':
            logger.error(`${err.name} - ${err.reason}`);
            res.status(403).send({ message: err.message });
            break;
        case 'NotFound':
        case 'NotFoundError':
            res.status(404).send();
            break;
        case 'PayloadTooLargeError':
            res.status(413).send({ message: `Request limit is: ${Math.floor(err.limit / 1024)} KiB`, detail: [`Received: ${Math.ceil(err.length / 1024)} KiB`] });
            break;
        case 'MongoError':
        case 'BulkWriteError':
            switch (err.code) {
                case 11000:
                    logger.info(err.message);
                    res.status(400).send({ message: 'Record already exists' });
                    break;
                default:
                    console.log(err);
                    logger.error(`Unhandled Mongo Error - ${err.code} - ${err.message}`);
                    res.status(500).send();
            }
            break;
        case 'StripeInvalidRequestError':
            logger.error(`${err.message} - ${err.reason}`);
            res.status(500).send();
            break;
        default:
            logger.error(`${err.name} - ${err.message}`);
            res.status(500).send();
    }
};
