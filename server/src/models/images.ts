import { Schema, Document, Model, model } from 'mongoose';

interface IImageModel extends Document {
    subscription: string;
    name: string;
    usage: string;
    size: number;
    created: Date;
    updated: Date;
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
    }
});

const ImageModel: Model<IImageModel> = model('images', ImageSchema) as Model<IImageModel>;

export { ImageModel, IImageModel };
