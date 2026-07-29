import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    // Fallback for local dev or build time without DB
    console.warn('CRITICAL: No MongoDB URI found in environment variables.');
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
            console.error('MONGO_URI/MONGODB_URI missing in dbConnect');
            // Mock connection object to prevent crashes
            cached.promise = Promise.resolve({
                connection: { readyState: 0 },
                model: () => ({ find: () => [], findOne: () => null, create: () => null }),
                models: {}
            });
        } else {
            const opts = {
                bufferCommands: false,
                dbName: 'taxiadmindash', // Explicitly target the correct database
                serverSelectionTimeoutMS: 10000, // Fail fast if DB is down/slow
                connectTimeoutMS: 10000
            };

            console.log(`Connecting to MongoDB... Target DB: ${opts.dbName}`);
            cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                console.log('MongoDB connected successfully to', mongoose.connection.db.databaseName);
                return mongoose;
            });
        }
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        console.error('MongoDB connection error:', e.message);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
