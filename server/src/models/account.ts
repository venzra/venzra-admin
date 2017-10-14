import { Schema, Document, Model, model } from 'mongoose';
import { ISubscriptionModel } from './subscription';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

interface IAccountPassword {
    salt: string;
    secure: string;
    created: Date;
}

interface IAccountLogin {
    key: string;
    ip: string;
    created: Date;
}

interface IAccountFailure {
    failures: number;
    ip?: string;
    updated?: Date;
}

interface IAccountValidation {
    key: string;
    expires: Date;
}

interface IAccountModel extends Document {
    subscription?: ISubscriptionModel;
    identity?: string;
    password?: IAccountPassword;
    access?: IAccountLogin,
    lock?: IAccountFailure;
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
        validate: [
            (val: string) => EMAIL_REGEX.test(val), 'Invalid email address'
        ]
    },
    password: {
        type: {
            salt: {
                type: String,
                required: true
            },
            secure: {
                type: String,
                required: true
            },
            created: {
                type: Date,
                required: true
            }
        }
    },
    access: {
        type: {
            key: {
                type: String,
                required: true
            },
            ip: {
                type: String,
                required: true
            },
            created: {
                type: Date,
                required: true
            }
        }
    },
    lock: {
        type: {
            failures: {
                type: Number,
                required: true,
                default: 0
            },
            ip: {
                type: String
            },
            updated: {
                type: Date
            }
        }
    },
    validation: {
        type: {
            key: {
                type: String,
                required: true
            },
            expires: {
                type: Date,
                required: true
            }
        }
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

const AccountModel: Model<IAccountModel> = model('accounts', AccountSchema);

export { AccountModel, IAccountModel, IAccountPassword, IAccountLogin };
