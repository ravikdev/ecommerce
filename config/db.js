import mongoose from 'mongoose';

export default async function connectDB() {
  return mongoose.connect(process.env.MONGO_URI);
}
