import { Schema, Document } from 'mongoose';

interface IThemeModel extends Document {
    color: string;
}

const ThemeSchema: Schema = new Schema({
    color: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    }
}, { _id: false });

export { IThemeModel, ThemeSchema };
