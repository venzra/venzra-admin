import { Schema, Document, Model, model } from 'mongoose';
import { GatewaySchema, IGatewayModel } from './objects/gateway';
import { FeeSchema, IFeeModel } from './objects/transaction';
import { IPaymentModel, PaymentSchema } from './objects/payment';

interface ISubscriptionModel extends Document {
    storeName?: string;
    strapline?: string;
    payment?: IPaymentModel;
    gateway?: IGatewayModel;
    transactions: IFeeModel;
    status?: string;
}

const SubscriptionSchema: Schema = new Schema({
    storeName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
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
        type: PaymentSchema
    },
    gateway: {
        type: GatewaySchema
    },
    transactions: {
        type: FeeSchema,
        default: FeeSchema
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

const SubscriptionModel: Model<ISubscriptionModel> = model('subscriptions', SubscriptionSchema) as Model<ISubscriptionModel>;

export { SubscriptionModel, ISubscriptionModel };
