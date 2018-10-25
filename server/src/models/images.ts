import { Schema, Document, Model, model } from 'mongoose';
import { IProductModel } from './products';

interface IImageModel extends Document {
    subscription: string;
    name: string;
    usage: string;
    path: string;
    size: number;
    created: Date;
    updated: Date;
}

const ImageSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    usage: {
        type: String,
        enum: ['logo', 'icon', 'feature', 'promotion'],
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

ImageSchema.pre('validate', function (this: IImageModel, next: any) {
    switch (this.usage) {
        case 'feature':
        case 'promotion':
            this.path = `${this.subscription}/${this.usage}/${this._id}.jpg`;
            break;
        default:
            this.path = `${this.subscription}/${this.usage}/${this._id}.png`;
    }
    next();
});

const ImageModel: Model<IImageModel> = model('images', ImageSchema) as Model<IImageModel>;

export { ImageModel, IImageModel };
