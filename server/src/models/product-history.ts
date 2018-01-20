import { Schema, Model, model } from 'mongoose';

import { IHistoryModel } from './objects/history';

const ProductHistorySchema: Schema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    field: {
        type: String,
        required: true
    },
    previous: {
        type: String
    },
    next: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 2419200
    }
});

const ProductHistoryModel: Model<IHistoryModel> = model('productHistory', ProductHistorySchema, 'productHistory') as Model<IHistoryModel>;

export { ProductHistoryModel, IHistoryModel };
