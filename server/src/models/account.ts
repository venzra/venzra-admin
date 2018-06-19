import { Schema, Document, Model, model } from 'mongoose';

import { ISubscriptionModel } from './subscription';

import { AccountPasswordSchema, IAccountPassword } from './objects/password';
import { AccountValidationSchema, IAccountValidation } from './objects/account-validation';
import { AccountAccessSchema, IAccountAccess } from './objects/account-access';
import { AccountBlockedSchema, IAccountBlocked } from './objects/account-blocked';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

interface IAccountModel extends Document {
    subscription?: ISubscriptionModel;
    identity?: string;
    password?: IAccountPassword;
    access?: IAccountAccess;
    lock?: IAccountBlocked;
    validation?: IAccountValidation;
    status?: string;
}

const AccountSchema: Schema = new Schema({
    subscription: {
        type: Schema.Types.ObjectId,
        ref: 'subscriptions'
    },
    identity: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 80,
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
    validation: {
        type: AccountValidationSchema
    },
    terms: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['REGISTERED', 'ACTIVE', 'RECOVERY', 'LOCKED', 'DISABLED'],
        required: true,
        default: 'REGISTERED'
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

AccountSchema.index({ identity: 1 }, { unique: true });

AccountSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const AccountModel: Model<IAccountModel> = model('accounts', AccountSchema) as Model<IAccountModel>;

export { AccountModel, IAccountModel };
