import { Schema, Document, Model, model } from 'mongoose';

import { IHistoryModel } from './product-history';

interface IProductModel extends Document {
    subscription?: string;
    code: string;
    displayName: string;
    previousPrice: number;
    currentPrice: number;
    history?: IHistoryModel[];
    status?: string;
}

const ProductSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    featureImage: {
        type: Schema.Types.ObjectId,
        ref: 'images'
    },
    promotionalImage: {
        type: Schema.Types.ObjectId,
        ref: 'images',
        required: true
    },
    previousPrice: {
        type: Number,
        min: 0,
        default: 0
    },
    currentPrice: {
        type: Number,
        required: true,
        min: 0
    },
    history: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'productHistory'
        }]
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        required: true,
        default: 'INACTIVE'
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

ProductSchema.index({ subscription: 1, code: 1 }, { unique: true });
ProductSchema.index({ subscription: 1, slug: 1 }, { unique: true });

ProductSchema.index({ code: 1 });
ProductSchema.index({ displayName: 1 });
ProductSchema.index({ currentPrice: 1 });
ProductSchema.index({ status: 1 });

ProductSchema.pre('validate', function (next) {
    this.slug = (this.displayName || '').replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-');
    this.previousPrice = this.previousPrice ? Math.floor(this.previousPrice) : this.previousPrice;
    this.currentPrice = this.currentPrice ? Math.floor(this.currentPrice) : this.currentPrice;
    next();
});

ProductSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const ProductModel: Model<IProductModel> = model('products', ProductSchema) as Model<IProductModel>;

export { ProductModel, IProductModel };
