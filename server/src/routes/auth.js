import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,

} from '../controllers/authController.js';
import { validate } from '../middleware/validation.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,

} from '../middleware/validation.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);


// Protected routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
