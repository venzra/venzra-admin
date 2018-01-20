import { Schema } from 'mongoose';
import { ChargesSchema, IChargesModel } from './charges';

interface ISubscriptionPaymentModel {
    package: string;
    customer: string;
    subscription: string;
    price: IChargesModel;
    term: Date;
    status: string;
}

const SubscriptionPaymentSchema: Schema = new Schema({
    package: String,
    customer: String,
    subscription: String,
    price: {
        type: ChargesSchema
    },
    term: Date,
    status: {
        type: String,
        enum: ['TRIALING', 'ACTIVE', 'PAST_DUE', 'UNPAID', 'CANCELED'],
        uppercase: true
    }
}, { _id: false });

SubscriptionPaymentSchema.index({ customer: 1 }, { unique: true, sparse: true });

export { ISubscriptionPaymentModel, SubscriptionPaymentSchema };
