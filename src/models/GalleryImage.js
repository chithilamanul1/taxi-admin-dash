import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    caption: { type: String },
    category: { type: String, default: 'General' },
    sortOrder: { type: Number, default: 99 },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema);

export default GalleryImage;
