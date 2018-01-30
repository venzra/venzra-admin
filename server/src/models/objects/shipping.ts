import { Schema, Document } from 'mongoose';

interface IShippingModel extends Document {
    name: string;
    courier: string;
    tracking: string;
    price: number;
}

const ShippingSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    courier: {
        type: String,
        maxlength: 30
    },
    tracking: {
        type: String,
        maxlength: 30
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

export { IShippingModel, ShippingSchema };
