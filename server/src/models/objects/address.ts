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
        required: true
    },
    street: {
        type: String,
        required: true
    },
    building: {
        type: String
    },
    city: {
        type: String
    },
    county: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
}, { _id: false });

export { IAddressModel, AddressSchema };
