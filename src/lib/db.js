import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    // Fallback for local dev or build time without DB
    console.warn('MONGO_URI not found.');
    // PREVENT HANGING: Disable buffering so queries fail fast instead of waiting forever
    mongoose.set('bufferCommands', false);
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
        if (!MONGODB_URI) {
            console.error('MONGO_URI missing in dbConnect');
            // Mock connection object to prevent crashes
            cached.promise = Promise.resolve({
                connection: { readyState: 0 },
                model: () => ({ find: () => [], findOne: () => null, create: () => null }),
                models: {}
            });
        } else {
            const opts = {
                bufferCommands: false,
            };

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
