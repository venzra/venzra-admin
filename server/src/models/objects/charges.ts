import { Schema } from 'mongoose';

interface IChargesModel {
    currency: string;
    quantity: number;
    value: number;
}

const ChargesSchema: Schema = new Schema({
    currency: String,
    quantity: Number,
    value: Number
}, { _id: false });

export { IChargesModel, ChargesSchema };
