import userModel from '../models/userModel.js';
import JWT from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../helpers/authhelper.js';

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role,
});
const nonemptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const validEmail = (value) => nonemptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const registerController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body || {};
    if (![name, phone, address].every(nonemptyString) || !validEmail(email) ||
        typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72) {
      return res.status(400).send({ success: false, message: 'Provide name, email, phone, address and a password of at least 8 characters (maximum 72 bytes)' });
    }
    if (await userModel.findOne({ email: email.trim() })) {
      return res.status(409).send({ success: false, message: 'Unable to register this email' });
    }
    const hashedPassword = await hashPassword(password);
    // Public registration must never grant privileges supplied by the caller.
    const user = await new userModel({ name, email: email.trim(), phone, address, password: hashedPassword, role: 0 }).save();
    return res.status(201).send({ success: true, message: 'User registered successfully', user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ success: false, message: 'Unable to register this email' });
    }
    return res.status(500).send({ success: false, message: 'Error in registration' });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!validEmail(email) || typeof password !== 'string' || !password.length || Buffer.byteLength(password) > 72) {
      return res.status(400).send({ success: false, message: 'Invalid email or password' });
    }
    const user = await userModel.findOne({ email: email.trim() }).select('+password');
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).send({ success: false, message: 'Invalid email or password' });
    }
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' });
    return res.status(200).send({ success: true, message: 'Login successful', user: publicUser(user), token });
  } catch {
    return res.status(500).send({ success: false, message: 'Error in login' });
  }
};

export const testController = (req, res) => res.send('protected route');
