import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    // Fallback for local dev if .env.local is being weird with encoding
    console.warn('MONGO_URI not found in environment, checking fallback...');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        if (!MONGODB_URI) {
            console.error('MONGO_URI missing in dbConnect');
            // Return a null promise or throw a specific error that can be caught? 
            // In build context, we want to fail gracefully if possible, or simple throw so caller handles it.
            // But caller `cached.promise` expects a promise.
            // Let's resolve to null.
            cached.promise = Promise.resolve(null);
        } else {
            cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                return mongoose;
            });
        }
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
