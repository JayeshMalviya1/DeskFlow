import 'dotenv/config';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * Boots the HTTP server after MongoDB is available.
 * Registers shutdown hooks for graceful exit.
 */
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`DeskFlow API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  console.error(
    'Render checklist: set MONGODB_URI in Environment, Atlas Network Access 0.0.0.0/0, correct password in URI.'
  );
  process.exit(1);
});
