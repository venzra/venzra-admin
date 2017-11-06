import { Schema, Document, Model, model } from 'mongoose';

interface IProductHistoryModel {
    account: string;
    field: string;
    previous: any;
    next: any;
    updated?: Date;
}

interface IProductModel extends Document {
    subscription?: string;
    code: string;
    displayName: string;
    retailPrice: number;
    storePrice: number;
    history?: [IProductHistoryModel];
    status?: string;
}

const ProductSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
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
    slug: {
        type: String,
        lowercase: true
    },
    retailPrice: {
        type: Number,
        min: 0,
        default: 0
    },
    storePrice: {
        type: Number,
        required: true,
        min: 0
    },
    history: {
        type: [{
            account: {
                type: Schema.Types.ObjectId,
                ref: 'accounts',
                required: true
            },
            field: {
                type: String,
                enum: ['retailPrice', 'storePrice', 'status'],
                required: true
            },
            previous: {
                type: String,
                required: true
            },
            next: {
                type: String,
                required: true
            },
            updated: {
                type: Date,
                required: true,
                default: Date.now
            }
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

ProductSchema.pre('validate', function (next) {
    this.slug = (this.displayName || '').replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-');
    this.retailPrice = this.retailPrice ? Math.floor(this.retailPrice) : this.retailPrice;
    this.storePrice = this.storePrice ? Math.floor(this.storePrice) : this.storePrice;
    next();
});

ProductSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const ProductModel: Model<IProductModel> = model('products', ProductSchema);

export { ProductModel, IProductModel };
