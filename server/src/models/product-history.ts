import { Schema, Document, Model, model } from 'mongoose';

interface IHistoryModel extends Document {
    account: string;
    table: string;
    field: string;
    previous: any;
    next: any;
    updated?: Date;
}

const ProductHistorySchema: Schema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    table: {
        type: String,
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
        expires: 604800
    }
});

const ProductHistoryModel: Model<IHistoryModel> = model('productHistory', ProductHistorySchema, 'productHistory') as Model<IHistoryModel>;

export { ProductHistoryModel, IHistoryModel };
