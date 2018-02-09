import { Schema, Document, Model, model } from 'mongoose';

interface IPlanModel extends Document {
    reference: string;
    name: string;
    currency: string;
    price: number;
    interval: number;
    frequency: string;
}

const PlanSchema: Schema = new Schema({
    reference: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 40
    },
    currency: {
        type: String,
        required: true,
        maxlength: 3
    },
    price: {
        type: Number,
        required: true,
        max: 999999999999999
    },
    interval: {
        type: Number,
        required: true,
        max: 999
    },
    frequency: {
        type: String,
        enum: ['day', 'week', 'month', 'year'],
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated: {
        type: Date,
        required: true,
        default: Date.now
    }
});

PlanSchema.index({ name: 1 }, { unique: true });

PlanSchema.pre('save', function (next) {
    this.updated = Date.now();
    next();
});

const PlanModel: Model<IPlanModel> = model('plans', PlanSchema) as Model<IPlanModel>;

export { PlanModel, IPlanModel };
