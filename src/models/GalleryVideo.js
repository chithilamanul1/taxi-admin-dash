import mongoose from 'mongoose';

const galleryVideoSchema = new mongoose.Schema({
    url: { type: String, required: true }, // e.g. YouTube, Facebook, TikTok URL
    platform: { type: String, required: true }, // 'youtube', 'facebook', 'tiktok', 'other'
    caption: { type: String },
    sortOrder: { type: Number, default: 99 },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const GalleryVideo = mongoose.models.GalleryVideo || mongoose.model('GalleryVideo', galleryVideoSchema);

export default GalleryVideo;
