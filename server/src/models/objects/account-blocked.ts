import { Schema } from 'mongoose';

interface IAccountBlocked {
    failures: number;
    ip?: string;
    updated?: Date;
}

const AccountBlockedSchema: Schema = new Schema({
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
}, { _id: false });

export { IAccountBlocked, AccountBlockedSchema };
