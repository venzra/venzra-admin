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
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    interval: {
        type: Number,
        required: true
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
