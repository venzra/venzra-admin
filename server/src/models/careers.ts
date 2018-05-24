import moment = require('moment');

import { Schema, Document, Model, model } from 'mongoose';

interface ICareerModel extends Document {
    position: string;
    description: string;
    expires: Date;
    created: Date;
    updated: Date;
}

const CareerSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    position: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    expires: {
        type: Date,
        required: true,
        expires: 604800
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

CareerSchema.pre('validate', function (this: ICareerModel, next: any) {
    if (this.expires) {
        this.expires = moment(this.expires).endOf('day').toDate();
    }
    next();
});

CareerSchema.pre('save', function (this: ICareerModel, next: any) {
    this.updated = new Date();
    next();
});

const CareerModel: Model<ICareerModel> = model('careers', CareerSchema) as Model<ICareerModel>;

export { CareerModel, ICareerModel };
