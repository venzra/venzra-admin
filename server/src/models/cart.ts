import { Schema, Document, Model, model } from 'mongoose';

import { IShippingModel, ShippingSchema } from './objects/shipping';

interface ICartItem {
    product: any;
    quantity?: number;
}

interface ICartModel extends Document {
    subscription?: string;
    items: ICartItem[];
    shipping: IShippingModel;
    value?: number;
    created: Date;
    updated: Date;
}

const CartSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    items: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        default: []
    },
    shipping: {
        type: ShippingSchema
    },
    ip: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 2419200
    }
});

CartSchema.pre('save', function (this: ICartModel, next: any) {
    this.updated = new Date();
    next();
});

const CartModel: Model<ICartModel> = model('carts', CartSchema) as Model<ICartModel>;

export { CartModel, ICartModel, ICartItem };
