import { Schema, Document } from 'mongoose';

interface IFeeModel extends Document {
    venzra: { amount: number, currency: string };
    gateway: { amount: number, currency: string };
    total: number;
}

const FeeSchema: Schema = new Schema({
    venzra: {
        type: {
            amount: Number,
            currency: String,
            refund: Number
        },
        required: true
    },
    gateway: {
        type: {
            amount: Number,
            currency: String,
            refund: Number
        },
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { _id: false });

export { IFeeModel, FeeSchema };
