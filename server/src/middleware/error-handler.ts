import { Request, Response, NextFunction } from 'express';

import * as winston from 'winston';

import { IAccountModel } from '../models/account';

interface IVenzraError {
    name: string;
    account?: IAccountModel;
    message: string;
    reason?: string;

    loggerMessage(): string;
}

class VenzraError extends Error {
    constructor(public message: string) {
        super();
        this.name = this.constructor.name;
    }
}

export class AccessDeniedError extends VenzraError implements IVenzraError {
    constructor(public reason: string) {
        super('Access Denied');
    }

    loggerMessage() {
        return this.reason;
    }
}

export class AuthenticationError extends VenzraError implements IVenzraError {
    constructor(public account: IAccountModel, public reason: string) {
        super('Invalid user credentials');
    }

    loggerMessage() {
        return `${this.reason} for ${this.account.identity || 'unknown'}`;
    }
}

export class NotFoundError extends VenzraError implements IVenzraError {
    constructor() {
        super('Page not found');
    }

    loggerMessage() {
        return this.message;
    }
}

export const errorHandler = (err: IVenzraError, req: Request, res: Response, next: NextFunction): void => {
    const logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                timestamp: () => Date.now(),
                formatter: (options) => `${req.ip} - ERROR LOG - [${new Date(options.timestamp()).toISOString()}] - "${req.method} ${req.originalUrl}" ${options.level.toUpperCase()} "${options.message}"`
            })
        ]
    });

    switch (err.name) {
        case 'AccessDeniedError':
        case 'AuthenticationError':
            logger.info(err.loggerMessage());
            res.clearCookie('jwt');
            res.status(401).send({ message: err.message });
            break;
        case 'NotFoundError':
            res.status(404).send();
            break;
        default:
            logger.info(err.message);
            res.status(400).send();
    }

};
