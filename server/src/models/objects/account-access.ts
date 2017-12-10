import { Schema } from 'mongoose';

interface IAccountAccess {
    key: string;
    ip: string;
    created: Date;
}

const AccountAccessSchema: Schema = new Schema({
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
}, { _id: false });

export { IAccountAccess, AccountAccessSchema };
