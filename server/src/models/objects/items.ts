import { Schema, Document } from 'mongoose';

interface IItemModel extends Document {
    product: string;
    quantity: number;
    price: number;
}

const ItemSchema: Schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

export { IItemModel, ItemSchema };
