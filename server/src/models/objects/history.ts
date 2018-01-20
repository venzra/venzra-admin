import { Document } from 'mongoose';

export interface IHistoryModel extends Document {
    account?: string;
    field: string;
    previous: any;
    next: any;
    updated?: Date;
}
