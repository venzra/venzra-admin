import { Schema, Document, Model, model } from 'mongoose';

interface IGatewayBank {
    name: string;
    holder: string;
    number: string;
    sortCode: string;
    created: Date;
}

interface IGatewayModel {
    account: string;
    bank: IGatewayBank[];
    publicKey: string;
    privateKey: string;
}

interface IChargesModel {
    currency: string;
    quantity: number;
    value: number;
}

interface IPaymentModel {
    package: string;
    customer: string;
    subscription: string;
    price: IChargesModel;
}

interface ISubscriptionModel extends Document {
    storeName?: string;
    strapline?: string;
    payment?: IPaymentModel;
    gateway?: IGatewayModel;
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
    payment: {
        type: {
            package: {
                type: String,
                required: true
            },
            customer: {
                type: String,
                required: true
            },
            subscription: {
                type: String,
                required: true
            },
            price: {
                type: {
                    currency: String,
                    quantity: Number,
                    value: Number
                }
            }
        }
    },
    gateway: {
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
SubscriptionSchema.index({ 'payment.customer': 1 }, { unique: true, sparse: true });

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
