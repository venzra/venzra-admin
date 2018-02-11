import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as path from 'path';

import AccountController from './controllers/account';
import IdentityController from './controllers/identity';
import ImagesController from './controllers/images';
import OrdersController from './controllers/orders';
import ProductsController from './controllers/products';
import ShippingController from './controllers/shipping';
import StatisticsController from './controllers/statistics';
import SubscriptionController from './controllers/subscription';
import ValidationController from './controllers/validation';
import WebhookController from './controllers/webhooks';

import { errorHandler } from './middleware/error-handler';

require('mongoose').Promise = global.Promise;

/*
 * Database connection
 */
const mongo = {
    uri: process.env['DB_URI'] as string,
    options: {
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
 * Configure security elements
 */
const app: express.Application = express();
app.enable('trust proxy');
app.disable('x-powered-by');
app.use(cookieParser());

/*
 * Register routing endpoints
 */
app.use('/api', morgan(':remote-addr - BASIC LOG - [:date[iso]] - ":method :url" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));

app.use('/api/account', AccountController);
app.use('/api/identity', IdentityController);
app.use('/api/images', ImagesController);
app.use('/api/orders', OrdersController);
app.use('/api/products', ProductsController);
app.use('/api/shipping', ShippingController);
app.use('/api/statistics', StatisticsController);
app.use('/api/subscription', SubscriptionController);
app.use('/api/validation', ValidationController);
app.use('/api/webhooks', WebhookController);

app.use(express.static(path.join(__dirname, '../client')));

app.route('*').get((req, res, next) => {
    if (req.url.startsWith('/assets')) {
        return next();
    }

    res.type('html');
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.use(errorHandler);

/*
 * Create the server
 */
const server = http.createServer(app);
const port = process.env['PORT'];

server.listen(port);
server.on('listening', listening);

function listening() {
    const addr = server.address();
    console.log(`Listening on ${addr.address}:${addr.port}`);
}

module.exports = app;
