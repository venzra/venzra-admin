import { Router } from 'express';

import { AuthenticationController } from './authentication';

class AccountController extends AuthenticationController {

    constructor(private router: Router) {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/account', this.validate.bind(this), this.getAccount.bind(this));
    }

}

export { AccountController };
