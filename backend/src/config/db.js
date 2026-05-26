import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using MONGODB_URI from environment variables.
 * Throws on failure so server.js can log a clear message before exit.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Add it in Render → Environment (or backend/.env locally).'
    );
  }

  if (uri.includes('<') || uri.includes('PASSWORD') || uri.includes('username')) {
    throw new Error(
      'MONGODB_URI looks like a placeholder. Use your real Atlas connection string.'
    );
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
};

/**
 * Gracefully closes the Mongoose connection (used during shutdown).
 */
export const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};
