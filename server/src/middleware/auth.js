import { verifyAccessToken } from '../utils/jwt.js';
import { createErrorResponse } from '../utils/response.js';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(createErrorResponse('Access token required'));
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-passwordHash -passwordResetTokenHash -passwordResetExpires');
      
      if (!user) {
        return res.status(401).json(createErrorResponse('User not found'));
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json(createErrorResponse('Invalid or expired token'));
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json(createErrorResponse('Authentication error'));
  }
};

export default authenticate;
