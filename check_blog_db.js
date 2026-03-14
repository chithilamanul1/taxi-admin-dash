const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const PostSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    isPublished: Boolean
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function checkPosts() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        console.error('No MONGODB_URI found');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');
        const posts = await Post.find({});
        console.log('Posts found:', posts.length);
        posts.forEach(p => {
            console.log(`Title: ${p.title} | Image: ${p.imageUrl} | Published: ${p.isPublished}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error('DB Error:', err);
    }
}

checkPosts();
