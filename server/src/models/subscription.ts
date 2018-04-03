import { Schema, Document, Model, model } from 'mongoose';
import { v4 } from 'uuid';

import { AddonSchema, IAddonModel } from './objects/addons';
import { GatewaySchema, IGatewayModel } from './objects/gateway';
import { FeeSchema, IFeeModel } from './objects/transaction';
import { ContactSchema, IContactModel } from './objects/contact';
import { IThemeModel, ThemeSchema } from './objects/theme';
import { ISubscriptionPaymentModel, SubscriptionPaymentSchema } from './objects/subscription-payment';

interface ISubscriptionModel extends Document {
    storeName?: string;
    addons: IAddonModel[];
    strapline?: string;
    domainName?: string;
    icon?: string;
    logo?: string;
    theme?: IThemeModel;
    contact?: IContactModel;
    payment?: ISubscriptionPaymentModel;
    gateway?: IGatewayModel;
    transactions: IFeeModel;
    status?: string;
}

const SubscriptionSchema: Schema = new Schema({
    storeName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 40
    },
    addons: {
        type: [AddonSchema],
        default: []
    },
    strapline: {
        type: String,
        trim: true,
        maxlength: 120
    },
    domainName: {
        type: String,
        lowercase: true,
        required: true
    },
    icon: {
        type: Schema.Types.ObjectId,
        ref: 'images'
    },
    logo: {
        type: Schema.Types.ObjectId,
        ref: 'images'
    },
    contact: {
        type: ContactSchema
    },
    theme: {
        type: ThemeSchema
    },
    payment: {
        type: SubscriptionPaymentSchema
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
    this.storeName = this.storeName || `store ${v4().substr(0, 8)}`;
    this.domainName = (this.storeName).replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-');
    next();
});

SubscriptionSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const SubscriptionModel: Model<ISubscriptionModel> = model('subscriptions', SubscriptionSchema) as Model<ISubscriptionModel>;

export { SubscriptionModel, ISubscriptionModel };
