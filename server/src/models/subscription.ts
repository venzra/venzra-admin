import { Schema, Document, Model, model } from 'mongoose';

interface IStripeBank {
    name: string;
    holder: string;
    number: string;
    sortCode: string;
    created: Date;
}

interface IStripeModel {
    account: string;
    bank: [IStripeBank];
    publicKey: string;
    privateKey: string;
}

interface ISubscriptionModel extends Document {
    storeName?: string;
    strapline?: string;
    stripe?: IStripeModel;
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
    stripe: {
        type: {
            account: {
                type: String,
                required: true
            },
            bank: {
                type: [{
                    name: {
                        type: String,
                        required: true
                    },
                    holder: {
                        type: String,
                        required: true
                    },
                    number: {
                        type: String,
                        required: true
                    },
                    sortCode: {
                        type: String,
                        required: true
                    },
                    created: {
                        type: Date,
                        required: true
                    }
                }]
            },
            publicKey: {
                type: String,
                required: true
            },
            privateKey: {
                type: String,
                required: true
            }
        }
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
SubscriptionSchema.index({ domainName: 1 }, { unique: true });

SubscriptionSchema.pre('validate', function (next) {
    this.domainName = (this.storeName || '').replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-');
    next();
});

SubscriptionSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const SubscriptionModel: Model<ISubscriptionModel> = model('subscriptions', SubscriptionSchema);

export { SubscriptionModel, ISubscriptionModel };
