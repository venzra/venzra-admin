import { Schema, Model, model } from 'mongoose';

import { IHistoryModel } from './objects/history';

const OrderHistorySchema: Schema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
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
        expires: 7776000
    }
});

const OrderHistoryModel: Model<IHistoryModel> = model('orderHistory', OrderHistorySchema, 'orderHistory') as Model<IHistoryModel>;

export { OrderHistoryModel, IHistoryModel };
