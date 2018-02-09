import { Schema, Document } from 'mongoose';

interface IAddressModel extends Document {
    addressee: string;
    street?: string;
    building?: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
}

const AddressSchema: Schema = new Schema({
    addressee: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },
    street: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    building: {
        type: String,
        trim: true,
        maxlength: 50
    },
    city: {
        type: String,
        trim: true,
        maxlength: 50
    },
    county: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    postalCode: {
        type: String,
        required: true,
        trim: true,
        maxlength: 12
    },
    country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    }
}, { _id: false });

export { IAddressModel, AddressSchema };
