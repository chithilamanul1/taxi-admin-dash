import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    content: {
        type: String,
        required: [true, 'Please provide content']
    },
    excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot be more than 200 characters']
    },
    coverImage: {
        type: String,
        default: '/logo.png' // Default to logo if no image provided
    },
    tags: {
        type: [String],
        default: []
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    },
    author: {
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
