import { Schema, Document, Model, model } from 'mongoose';


interface IProductModel extends Document {
    code: string;
    name: string;
    price: number;
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
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['DRAFT', 'AVAILABLE', 'WITHDRAWN'],
        required: true,
        default: 'DRAFT'
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
    this.slug = (this.name || '').replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-');
    this.price = this.price ? Math.floor(this.price) : this.price;
    next();
});

ProductSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const ProductModel: Model<IProductModel> = model('products', ProductSchema);

export { ProductModel, IProductModel };
