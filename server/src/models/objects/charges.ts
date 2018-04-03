import { Schema } from 'mongoose';

interface IChargesModel {
    currency: string;
    quantity: number;
    value: number;
}

const ChargesSchema: Schema = new Schema({
    currency: {
        type: String
    },
    quantity: {
        type: Number
    },
    value: {
        type: Number
    }
}, { _id: false });

export { IChargesModel, ChargesSchema };
