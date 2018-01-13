import * as parser from 'body-parser';
import * as stream from 'stream';

import * as sharp from 'sharp';

import { Request, Response, NextFunction, Router } from 'express';
import { S3 } from 'aws-sdk';

import { AuthenticationController } from './authentication';

import { ImageModel } from '../models/images';
import { ThirdPartyError, ValidationError } from '../middleware/error-handler';

import { environment } from '../config';

export class ImagesController extends AuthenticationController {

    private awsClient: S3;

    public router: Router;

    constructor() {
        super();
        this.awsClient = new S3({ region: 'eu-west-1' });
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.raw({ type: 'image/*', limit: '1mb' }));

        this.router.post('/', this.validate.bind(this), this.processImage.bind(this), this.createImage.bind(this), this.findOne.bind(this));
        this.router.get('/:imageId', this.validate.bind(this), this.findOne.bind(this));
    }

    processImage(req: Request, res: Response, next: NextFunction) {
        let image = sharp(req.body);

        switch (req.query.usage) {
            case 'feature':
                image = image.resize(1024, 500).crop(sharp.gravity.center).jpeg({ quality: 60 });
                break;
            case 'promotion':
                image = image.resize(512, 512).crop(sharp.gravity.center).jpeg({ quality: 75 });
                break;
            case 'logo':
                image = image.resize(400, 100).max().jpeg({ quality: 90 });
                break;
            default:
                image = image.resize(180, 180).crop(sharp.gravity.center).png();
        }

        image.toBuffer()
            .then((imageBuffer) => req.body = imageBuffer)
            .then(() => next())
            .catch(() => next(new ValidationError([{ path: 'body', kind: 'invalid' }])));
    }

    createImage(req: Request, res: Response, next: NextFunction) {
        const errors = [];

        if (!req.query.name) {
            errors.push({ path: 'name', kind: 'required' });
        }

        if (!req.query.usage) {
            errors.push({ path: 'usage', kind: 'required' });
        }

        if (errors.length) {
            return next(new ValidationError(errors));
        }

        const image = new ImageModel({
            subscription: this.account.subscription._id,
            name: req.query.name,
            usage: req.query.usage
        });

        const ACL = 'private';
        const Bucket = environment.imageBucket;
        const Key = `${image.subscription}/${image.usage}/${image._id}`;
        const Body = Buffer.from(req.body, 'base64');
        const ContentType = 'image/jpeg';

        const params: S3.PutObjectRequest = { ACL, Bucket, Key, Body, ContentType };

        this.awsClient.putObject(params).promise()
            .then(() => image.set('size', Body.length))
            .then(() => image.save().then((result) => req.params.imageId = result._id))
            .then(() => {
                req.headers['content-type'] = 'application/json';
                next();
            })
            .catch((error) => next(new ThirdPartyError('S3 image upload', error)));
    }

    findOne(req: Request, res: Response, next: NextFunction) {
        ImageModel
            .findOne({ _id: req.params.imageId, subscription: this.account.subscription._id })
            .select('_id name usage size')
            .then((image) => {
                if (req.get('content-type') === 'application/json') {
                    res.status(200).send(image);
                } else {
                    return Promise.resolve()
                        .then(() => {
                            const Bucket = environment.imageBucket;
                            const Key = `${this.account.subscription._id}/${image.usage}/${image._id}`;

                            const params = { Bucket, Key };

                            return this.awsClient.headObject(params).promise();
                        })
                        .then((meta) => res.setHeader('content-type', meta.ContentType))
                        .then(() => {
                            const Bucket = environment.imageBucket;
                            const Key = `${this.account.subscription._id}/${image.usage}/${image._id}`;

                            const params = { Bucket, Key };

                            return this.awsClient.getObject(params).createReadStream();
                        })
                        .then((result: stream.Readable) => result.pipe(res));
                }
            })
            .catch((error) => next(error));
    }

}

export default new ImagesController().router;
