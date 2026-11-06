import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, select: false },
  address: { type: String, required: true },
  role: { type: Number, required: true, enum: [0, 1], default: 0 },
});

export default mongoose.model('users', userSchema);
