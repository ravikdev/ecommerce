import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';
import userModel from '../models/userModel.js';

export const requireSignIn = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    // Accept the existing raw-token format as well as standard Bearer tokens.
    const token = typeof header === 'string' ? header.replace(/^Bearer\s+/i, '') : '';
    const decoded = JWT.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!decoded || typeof decoded !== 'object' || !mongoose.isObjectIdOrHexString(decoded._id)) {
      return res.status(401).send({ success: false, message: 'Authentication required' });
    }
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).send({ success: false, message: 'Authentication required' });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || user.role !== 1) {
      return res.status(403).send({ success: false, message: 'Unauthorized access' });
    }
    return next();
  } catch {
    return res.status(500).send({ success: false, message: 'Unable to authorize request' });
  }
};
