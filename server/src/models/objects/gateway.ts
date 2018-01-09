import { Schema } from 'mongoose';

interface IGatewayModel {
    account: string;
    refreshToken: string,
    publicKey: string;
    privateKey: string;
    modified: Date;
}

const GatewaySchema: Schema = new Schema({
    account: String,
    refreshToken: String,
    publicKey: String,
    privateKey: String,
    modified: Date
}, { _id: false });

export { IGatewayModel, GatewaySchema };
