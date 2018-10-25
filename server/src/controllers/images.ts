import * as parser from 'body-parser';
import * as sharp from 'sharp';

import { Request, Response, NextFunction, Router } from 'express';
import { S3 } from 'aws-sdk';

import { AuthenticationController } from './authentication';

import { ImageModel } from '../models/images';
import { NotFoundError, ThirdPartyError, ValidationError } from '../middleware/error-handler';

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
                image = image.resize(1024, 500).crop(sharp.gravity.center).jpeg({ quality: 60, progressive: true });
                req.headers['content-type'] = 'image/jpeg';
                break;
            case 'promotion':
                image = image.resize(512, 512).crop(sharp.gravity.center).jpeg({ quality: 75, progressive: true });
                req.headers['content-type'] = 'image/jpeg';
                break;
            case 'logo':
                image = image.resize(400, 100).max().png();
                req.headers['content-type'] = 'image/png';
                break;
            default:
                image = image.resize(180, 180).crop(sharp.gravity.center).png();
                req.headers['content-type'] = 'image/png';
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

        const binary = Buffer.from(req.body, 'base64');
        const image = new ImageModel({
            subscription: this.account.subscription._id,
            name: req.query.name,
            usage: req.query.usage,
            size: binary.length
        });

        image.save()
            .then((result) => {
                req.params.imageId = result._id;

                const ACL = 'private';
                const Bucket = environment.imageBucket;
                const Key = image.path;
                const Body = binary;
                const ContentType = req.headers['content-type'];
                const CacheControl = 'max-age=31536000, public';

                const params: S3.PutObjectRequest = { ACL, Bucket, Key, Body, ContentType, CacheControl };

                return this.awsClient.putObject(params).promise();
            })
            .then(() => {
                req.headers['content-type'] = 'application/json';
                next();
            })
            .catch((error) => next(new ThirdPartyError('S3 image upload', error)));
    }

    findOne(req: Request, res: Response, next: NextFunction) {
        ImageModel
            .findOne({ _id: req.params.imageId, subscription: this.account.subscription._id })
            .select('_id name usage path size')
            .then((image) => {
                if (!image) {
                    throw new NotFoundError();
                }
                res.status(200).send(image);
            })
            .catch((error) => next(error));
    }

}

export default new ImagesController().router;
