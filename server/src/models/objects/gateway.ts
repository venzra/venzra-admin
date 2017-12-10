import { Schema } from 'mongoose';
import { AddressSchema, IAddressModel } from './address';
import { BankSchema, IBankModel } from './bank';
import { ContactSchema, IContactModel } from './contact';

interface IGatewayModel {
    account: string;
    entity: IContactModel;
    address: IAddressModel;
    bank: IBankModel[];
    publicKey: string;
    privateKey: string;
    modified: Date;
}

const GatewaySchema: Schema = new Schema({
    account: String,
    entity: {
        type: ContactSchema
    },
    address: {
        type: AddressSchema
    },
    bank: {
        type: [BankSchema]
    },
    publicKey: String,
    privateKey: String,
    modified: Date
}, { _id: false });

export { IGatewayModel, GatewaySchema };
