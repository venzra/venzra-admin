import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as path from 'path';

import { raw, json } from 'body-parser';

import { errorHandler } from './middleware/error-handler';
import { AccountController } from './controllers/account';
import { IdentityController } from './controllers/identity';
import { ProductsController } from './controllers/products';
import { SubscriptionController } from './controllers/subscription';
import { WebhookController } from './controllers/webhooks';

require('mongoose').Promise = global.Promise;

const app: express.Application = express();
const jsonRouter: express.Router = express();
const rawRouter: express.Router = express();

/*
 * Configure security elements
 */
app.disable('x-powered-by');
app.use(cookieParser());

/*
 * Register routing endpoints
 */
jsonRouter.use(json());
rawRouter.use(raw({ type: '*/*' }));

jsonRouter.use(morgan(':remote-addr - BASIC LOG - [:date[iso]] - ":method :url" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));

app.use('/api/v1/', jsonRouter);
app.use('/api/webhooks', rawRouter);

app.use(express.static(path.join(__dirname, '../client')));
app.route('*').get((req, res) => {
    res.type('html');
    res.send(fs.readFileSync(path.join(__dirname, '../client/index.html')));
});

/*
 * Database connection
 */
const mongo = {
    uri: `mongodb://${process.env.DB_URI || 'localhost/venzra'}`,
    options: {
        useMongoClient: true,
        socketTimeoutMS: 0,
        keepAlive: 120,
        reconnectTries: 30,
        poolSize: 5
    }
};

mongoose
    .connect(mongo.uri, mongo.options)
    .catch((err) => console.error(`Mongo connection error: ${err.message}`));

/*
 * Start controllers
 */
const account = new AccountController(jsonRouter);
const identity = new IdentityController(jsonRouter);
const products = new ProductsController(jsonRouter);
const subscription = new SubscriptionController(jsonRouter);
const webhooks = new WebhookController(rawRouter);

app.use(errorHandler);

/*
 * Create the server
 */
const server = http.createServer(app);
const port = process.env['PORT'] || 8181;

server.listen(port);
server.on('listening', listening);

function listening() {
    const addr = server.address();
    console.log(`Listening on ${addr.address}:${addr.port}`);
}

module.exports = app;
