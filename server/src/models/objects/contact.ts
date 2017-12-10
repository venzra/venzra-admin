import { Schema } from 'mongoose';

interface IContactModel {
    forename: string;
    surname: string;
    email: string;
    dob: Date;
}

const ContactSchema: Schema = new Schema({
    forename: String,
    surname: String,
    email: String,
    dob: Date
}, { _id: false });

export { IContactModel, ContactSchema };
