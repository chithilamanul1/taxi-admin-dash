import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    customerName: string;
    customerEmail: string;
    pickupLocation: {
        address: string;
        coordinates?: [number, number];
    };
    dropLocation: {
        address: string;
        coordinates?: [number, number];
    };
    stops: string[];
    vehicleType: string;
    price: number;
    status: 'Pending Driver' | 'Driver Assigned' | 'Completed' | 'Cancelled';
    date: string;
    time: string;
    passengers: number;
    createdAt: Date;
}

const BookingSchema: Schema = new Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    pickupLocation: {
        address: { type: String, required: true },
        coordinates: { type: [Number], index: '2dsphere' }
    },
    dropLocation: {
        address: { type: String, required: true },
        coordinates: { type: [Number], index: '2dsphere' }
    },
    stops: [{ type: String }],
    vehicleType: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending Driver', 'Driver Assigned', 'Completed', 'Cancelled'],
        default: 'Pending Driver'
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    passengers: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
