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
        uppercase: true,
        maxlength: 12
    },
    country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    }
});

AddressSchema.pre('validate', function (this: IAddressModel, next: any) {
    if (this.postalCode) {
        this.postalCode = this.postalCode.trim().replace(/\s+/g, '');
    }
    next();
});

export { IAddressModel, AddressSchema };
