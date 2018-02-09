import { Schema, Document } from 'mongoose';

interface IShippingModel extends Document {
    reference: string;
    name: string;
    courier: string;
    tracking: string;
    price: number;
}

const ShippingSchema: Schema = new Schema({
    reference: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },
    courier: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    tracking: {
        type: String,
        trim: true,
        maxlength: 30
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000
    }
}, { _id: false });

export { IShippingModel, ShippingSchema };
