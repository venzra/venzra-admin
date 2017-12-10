import { Schema } from 'mongoose';

interface IAccountPassword {
    salt: string;
    secure: string;
    created: Date;
}

const AccountPasswordSchema: Schema = new Schema({
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
}, { _id: false });

export { IAccountPassword, AccountPasswordSchema };
