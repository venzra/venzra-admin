import { Schema, Document, Model, model } from 'mongoose';

interface ILegalEntity {
    forename: string;
    surname: string;
    email: string;
    dob: Date;
}

interface IAddress {
    company?: string;
    building: string;
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
}

interface IGatewayBank {
    name: string;
    holder: string;
    number: string;
    sortCode: string;
}

interface IGatewayModel {
    account: string;
    entity: ILegalEntity;
    address: IAddress;
    bank: IGatewayBank[];
    publicKey: string;
    privateKey: string;
    modified: Date;
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
    term: Date;
    status: string;
}

interface ISubscriptionModel extends Document {
    storeName?: string;
    strapline?: string;
    payment?: IPaymentModel;
    gateway?: IGatewayModel;
    status?: string;
}

const PaymentSchema: Schema = new Schema({
    package: String,
    customer: String,
    subscription: String,
    price: {
        type: {
            currency: String,
            quantity: Number,
            value: Number
        }
    },
    term: Date,
    status: {
        type: String,
        enum: ['TRIALING', 'ACTIVE', 'PAST_DUE', 'UNPAID', 'CANCELED'],
        uppercase: true
    }
}, { _id: false });

const BankSchema: Schema = new Schema({
    name: String,
    holder: String,
    number: String,
    sortCode: String
}, { _id: false });

const GatewaySchema: Schema = new Schema({
    account: String,
    entity: {
        type: {
            forename: String,
            surname: String,
            email: String,
            dob: Date
        }
    },
    address: {
        type: {
            company: String,
            building: String,
            street: String,
            city: String,
            county: String,
            postalCode: String,
            country: String
        }
    },
    bank: {
        type: [BankSchema]
    },
    publicKey: String,
    privateKey: String,
    modified: Date
}, { _id: false });

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
        type: PaymentSchema
    },
    gateway: {
        type: GatewaySchema
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
