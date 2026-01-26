import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    // Customer info
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userImage: { type: String },

    // Review content
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },

    // Trip details (displayed on homepage)
    route: { type: String }, // e.g., "Colombo → Kandy"
    distance: { type: Number }, // km

    // Linked booking
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

    // Status
    isApproved: { type: Boolean, default: false }, // Requires admin approval
    isVerified: { type: Boolean, default: false }, // Has completed a booking
    showOnHomepage: { type: Boolean, default: true },

    // Source (for external reviews)
    source: {
        type: String,
        enum: ['website', 'google', 'tripadvisor', 'manual'],
        default: 'website'
    },
    externalUrl: { type: String }
}, {
    timestamps: true
});

// Indexes for faster queries
reviewSchema.index({ userEmail: 1 });
reviewSchema.index({ isApproved: 1, showOnHomepage: 1, createdAt: -1 });
reviewSchema.index({ bookingId: 1 });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;

