import { Schema, Document, Model, model } from 'mongoose';

interface IShippingModel extends Document {
    subscription?: string;
    displayName: string;
    cartMinimum: number;
    cartMaximum: number;
    currentPrice: number;
    shipmentTime: number;
}

const ShippingSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    cartMinimum: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    cartMaximum: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    currentPrice: {
        type: Number,
        required: true,
        min: 0
    },
    shipmentTime: {
        type: Number,
        required: true,
        min: 0,
        default: 48
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

ShippingSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const ShippingModel: Model<IShippingModel> = model('shipping', ShippingSchema, 'shipping') as Model<IShippingModel>;

export { ShippingModel, IShippingModel };
