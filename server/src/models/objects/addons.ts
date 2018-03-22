import { Schema } from 'mongoose';

interface IAddonModel {
    name: string;
    activated?: Date;
    value: number;
}

const AddonSchema: Schema = new Schema({
    name: {
        type: String,
        uppercase: true,
        required: true
    },
    activated: {
        type: Date,
        default: Date.now
    },
    value: {
        type: Number,
        required: true
    }
}, { _id: false });

export { IAddonModel, AddonSchema };
