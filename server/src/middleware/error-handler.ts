import { Request, Response, NextFunction } from 'express';

import * as winston from 'winston';

import { IAccountModel } from '../models/account';

interface IVenzraError {
    name: string;
    account?: string;
    message: string;
    reason?: string;
    errors?: any;

    loggerMessage(): string;
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

    loggerMessage() {
        return this.reason;
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
    constructor(public account: string, public reason: string) {
        super('Invalid user credentials');
    }

    loggerMessage() {
        return `${this.reason} for ${this.account || 'unknown'}`;
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
        case 'AccountAccessError':
            logger.info(err.loggerMessage());
            res.status(400).send({ message: err.message });
            break;
        case 'ValidationError':
            logger.info(err.message);
            const detail = new Set();
            for (let key of Object.keys(err.errors)) {
                detail.add(`${err.errors[key].path} ${err.errors[key].kind}`.trim());
            }
            res.status(400).send({ message: 'Validation failed', detail: [...detail] });
            break;
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
            logger.info(`${err.name} - ${err.message}`);
            res.status(500).send();
    }

};
