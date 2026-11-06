import 'dotenv/config';
import app from './server.js';
import connectDB from './config/db.js';

if (!process.env.MONGO_URI || !process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
  throw new Error('Configure MONGO_URI and a new JWT_SECRET of at least 32 bytes before starting');
}

try {
  await connectDB();
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
} catch {
  console.error('Unable to connect to the database; server was not started');
  process.exitCode = 1;
}
