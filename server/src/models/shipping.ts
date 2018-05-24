import { Schema, Document, Model, model } from 'mongoose';

interface IShippingModel extends Document {
    subscription?: string;
    displayName: string;
    cartMinimum: number;
    cartMaximum: number;
    currentPrice: number;
    shipmentTime: number;
    created: Date;
    updated: Date;
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
        trim: true,
        maxlength: 80
    },
    cartMinimum: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000,
        default: 0
    },
    cartMaximum: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000,
        default: 0
    },
    currentPrice: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000
    },
    shipmentTime: {
        type: Number,
        required: true,
        min: 0,
        max: 3000,
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

ShippingSchema.pre('save', function (this: IShippingModel, next: any) {
    this.updated = new Date();
    next();
});

const ShippingModel: Model<IShippingModel> = model('shipping', ShippingSchema, 'shipping') as Model<IShippingModel>;

export { ShippingModel, IShippingModel };
