import { Schema, Document, Model, model } from 'mongoose';
import { AddressSchema } from './objects/address';

interface ILocationModel extends Document {
    content: string;
    created: Date;
    updated: Date;
}

const LocationSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    address: {
        type: AddressSchema,
        required: true
    },
    featureImage: {
        type: Schema.Types.ObjectId,
        ref: 'images'
    },
    usage: {
        type: String,
        enum: ['BUSINESS', 'STORE'],
        uppercase: true,
        required: true,
        default: 'BUSINESS'
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated: {
        type: Date,
        required: true,
        default: Date.now
    }
});

LocationSchema.pre('save', function (this: ILocationModel, next) {
    this.updated = new Date();
    next();
});

const LocationModel: Model<ILocationModel> = model('locations', LocationSchema) as Model<ILocationModel>;

export { LocationModel, ILocationModel };
