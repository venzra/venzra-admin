import { Schema, Document } from 'mongoose';

interface IShippingModel extends Document {
    price: number;
}

const ShippingSchema: Schema = new Schema({
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
        required: true,
        default: 500
    }
}, { _id: false });

export { IShippingModel, ShippingSchema };
