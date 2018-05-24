import { Schema, Document, Model, model } from 'mongoose';

interface IContentModel extends Document {
    content: string;
    usage: string;
    created: Date;
    updated: Date;
}

const ContentSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions',
        required: true
    },
    content: {
        type: String,
        trim: true,
        maxlength: 20000
    },
    usage: {
        type: String,
        enum: ['ABOUT', 'CAREERS', 'CONTACT', 'LOCATION', 'TERMS'],
        uppercase: true,
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

ContentSchema.index({ subscription: 1, usage: 1 }, { unique: true });

ContentSchema.pre('save', function (this: IContentModel, next: any) {
    this.updated = new Date();
    next();
});

const ContentModel: Model<IContentModel> = model('content', ContentSchema, 'content') as Model<IContentModel>;

export { ContentModel, IContentModel };
