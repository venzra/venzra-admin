import { Schema } from 'mongoose';

interface IGatewayModel {
    account: string;
    refreshToken: string;
    publicKey: string;
    privateKey: string;
    modified: Date;
}

const GatewaySchema: Schema = new Schema({
    account: {
        type: String
    },
    refreshToken: {
        type: String
    },
    publicKey: {
        type: String
    },
    privateKey: {
        type: String
    },
    modified: {
        type: Date
    }
}, { _id: false });

export { IGatewayModel, GatewaySchema };
