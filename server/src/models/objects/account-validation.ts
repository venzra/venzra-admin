import { Schema } from 'mongoose';

interface IAccountValidation {
    key: string;
    expires: Date;
}

const AccountValidationSchema: Schema = new Schema({
    key: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
}, { _id: false });

export { IAccountValidation, AccountValidationSchema };
