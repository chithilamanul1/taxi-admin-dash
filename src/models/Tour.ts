import mongoose, { Schema, Document } from 'mongoose';

export interface ITour extends Document {
    title: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
    imageURL: string;
    category: string;
    includes: string[];
}

const TourSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    duration: { type: String, required: true },
    imageURL: { type: String, required: true },
    category: { type: String, required: true },
    includes: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model<ITour>('Tour', TourSchema);
