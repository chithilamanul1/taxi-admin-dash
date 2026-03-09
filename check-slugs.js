const mongoose = require('mongoose');

const dbUri = 'mongodb+srv://airporttaxis:admin123@cluster0.pvnpe.mongodb.net/taxiadmindash?retryWrites=true&w=majority';

const PostSchema = new mongoose.Schema({
    title: String,
    slug: String
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function checkSlugs() {
    try {
        console.log('Connecting to:', dbUri.replace(/:([^:@]+)@/, ':****@'));
        await mongoose.connect(dbUri);
        console.log('Connected to DB');
        const posts = await Post.find({}, 'title slug');
        console.log('Posts found:', posts.length);
        posts.forEach(p => {
            console.log(`ID: ${p._id}, Title: "${p.title}", Slug: "${p.slug}"`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkSlugs();
