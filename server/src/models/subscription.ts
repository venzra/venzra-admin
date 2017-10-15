import { Schema, Document, Model, model } from 'mongoose';

interface ISubscriptionModel extends Document {
    storeName?: string;
    strapline?: string;
    status?: string;
}

const SubscriptionSchema: Schema = new Schema({
    storeName: {
        type: String,
        required: true,
        trim: true
    },
    strapline: {
        type: String,
        trim: true
    },
    domainName: {
        type: String,
        lowercase: true
    },
    status: {
        type: String,
        enum: ['TRIAL', 'ACTIVE', 'INACTIVE'],
        required: true,
        default: 'TRIAL'
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

SubscriptionSchema.index({ storeName: 1 }, { unique: true });

SubscriptionSchema.pre('validate', function (next) {
    this.domainName = this.storeName.replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-');
    next();
});

SubscriptionSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const SubscriptionModel: Model<ISubscriptionModel> = model('subscriptions', SubscriptionSchema);

export { SubscriptionModel, ISubscriptionModel };
