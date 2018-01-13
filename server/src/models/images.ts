import { Schema, Document, Model, model } from 'mongoose';

interface IImageModel extends Document {
    subscription: string;
    name: string;
    usage: string;
    size: number;
}

const ImageSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    usage: {
        type: String,
        enum: ['logo', 'icon', 'feature', 'promotion'],
        required: true,
        trim: true
    },
    size: {
        type: Number,
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
        default: Date.now
    }
});

ImageSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const ImageModel: Model<IImageModel> = model('images', ImageSchema) as Model<IImageModel>;

export { ImageModel, IImageModel };
