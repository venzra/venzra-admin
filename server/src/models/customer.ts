import { Schema, Document, Model, model } from 'mongoose';
import { ISubscriptionModel } from './subscription';
import { AccountPasswordSchema } from './objects/password';
import { AccountAccessSchema } from './objects/account-access';
import { AccountBlockedSchema } from './objects/account-blocked';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

interface ICustomerPassword {
    salt: string;
    secure: string;
    created: Date;
}

interface ICustomerLogin {
    key: string;
    ip: string;
    created: Date;
}

interface ICustomerFailure {
    failures: number;
    ip?: string;
    updated?: Date;
}

interface ICustomerModel extends Document {
    subscription?: ISubscriptionModel;
    identity?: string;
    password?: ICustomerPassword;
    access?: ICustomerLogin;
    lock?: ICustomerFailure;
    status?: string;
}

const CustomerSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions'
    },
    identity: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: [
            (val: string) => EMAIL_REGEX.test(val), 'Invalid email address'
        ]
    },
    password: {
        type: AccountPasswordSchema
    },
    access: {
        type: AccountAccessSchema
    },
    lock: {
        type: AccountBlockedSchema,
        default: AccountBlockedSchema
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'RECOVERY', 'LOCKED'],
        required: true,
        default: 'ACTIVE'
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

CustomerSchema.index({ subscription: 1, identity: 1 }, { unique: true });

CustomerSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const CustomerModel: Model<ICustomerModel> = model('customers', CustomerSchema) as Model<ICustomerModel>;

export { CustomerModel, ICustomerModel, ICustomerPassword, ICustomerLogin };
