import { Schema } from 'mongoose';

interface IBankModel {
    name: string;
    holder: string;
    number: string;
    sortCode: string;
}

const BankSchema: Schema = new Schema({
    name: String,
    holder: String,
    number: String,
    sortCode: String
}, { _id: false });

export { IBankModel, BankSchema };
