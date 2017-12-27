import { Request, Response, NextFunction, Router } from 'express';
import { S3 } from 'aws-sdk';

import { AuthenticationController } from './authentication';

import { ImageModel } from '../models/images';
import { ThirdPartyError, ValidationError } from '../middleware/error-handler';

import { environment } from '../config';

class ImagesController extends AuthenticationController {

    private awsClient: S3;

    constructor(private router: Router) {
        super();
        this.registerRoutes();
        this.awsClient = new S3({ region: 'eu-west-1' });
    }

    registerRoutes() {
        this.router.post('/images', this.validate.bind(this), this.createImage.bind(this), this.findOne.bind(this));
        this.router.get('/images/:imageId', this.validate.bind(this), this.findOne.bind(this));
    }

    createImage(req: Request, res: Response, next: NextFunction) {
        const errors = [];

        if (!req.body.name) {
            errors.push({ path: 'name', kind: 'required' });
        }

        if (!req.body.usage) {
            errors.push({ path: 'usage', kind: 'required' });
        }

        if (errors.length) {
            return next(new ValidationError(errors));
        }

        const image = new ImageModel({
            subscription: this.account.subscription._id,
            name: req.body.name,
            usage: req.body.usage
        });

        const ACL = 'private';
        const Bucket = environment.imageBucket;
        const Key = `${image.subscription}/${image.usage}/${image._id}`;
        const Body = Buffer.from(req.body.data, 'base64');

        const params: S3.PutObjectRequest = { ACL, Bucket, Key, Body };

        this.awsClient.putObject(params).promise()
            .then(() => image.set('size', Body.length))
            .then(() => image.save().then((result) => req.params.imageId = result._id))
            .then((result) => next())
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
                        .then((stream) => stream.pipe(res));
                }
            })
            .catch((error) => next(error));
    }

}

export { ImagesController };
