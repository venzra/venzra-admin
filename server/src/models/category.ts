import { Schema, Document, model, Model } from 'mongoose';

interface ICategoryModel extends Document {
    slug: string;
    name: string;
    parent?: ICategoryModel;
    children?: ICategoryModel[];
    description: string;
    featureImage: string;
    created: Date;
    updated: Date;
}

const CategorySchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    children: {
        type: [Schema.Types.ObjectId],
        ref: 'categories',
        default: []
    },
    slug: {
        type: String,
        lowercase: true,
        maxlength: 30
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    primary: {
        type: Boolean,
        required: true,
        default: false
    },
    featureImage: {
        type: Schema.Types.ObjectId,
        ref: 'images'
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

CategorySchema.index({ subscription: 1, slug: 1 }, { unique: true });

CategorySchema.index({ name: 1 });

CategorySchema.pre('validate', function (next) {
    this.slug = (this.name || '').replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-');
    next();
});

CategorySchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const CategoryModel: Model<ICategoryModel> = model('categories', CategorySchema) as Model<ICategoryModel>;

export { CategoryModel, ICategoryModel };
