import * as parser from 'body-parser';

import { Router } from 'express';

import { AuthenticationController } from './authentication';

export class AccountController extends AuthenticationController {

    public router: Router;

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.json({ type: 'application/json' }));
        this.router.get('/', this.validate.bind(this), this.getAccount.bind(this));
    }

}

export default new AccountController().router;
