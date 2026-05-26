import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Exits the process on failure so the server does not run without a database.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Gracefully closes the Mongoose connection (used during shutdown).
 */
export const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};
