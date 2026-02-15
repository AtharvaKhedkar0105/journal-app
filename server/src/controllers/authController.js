import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import User from '../models/User.js';

// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(createErrorResponse('User already exists with this email'));
    }

    // Create new user
    const user = new User({ name, email, passwordHash: password });
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.status(201).json(createSuccessResponse({
      user: userResponse,
      accessToken
    }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(createErrorResponse('User not found'));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json(createErrorResponse('Invalid credentials'));
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json(createSuccessResponse({
      user: userResponse,
      accessToken
    }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json(createSuccessResponse(null, 'Logout successful'));
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json(createErrorResponse('Refresh token required'));
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json(createErrorResponse('User not found'));
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Set new refresh token in httpOnly cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json(createSuccessResponse({
      accessToken
    }, 'Token refreshed successfully'));
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json(createErrorResponse('Invalid or expired refresh token'));
    }
    next(error);
  }
};

// Get current user
const getMe = (req, res) => {
  const userResponse = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt
  };

  res.json(createSuccessResponse(userResponse, 'User retrieved successfully'));
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(createErrorResponse('User not found'));
    }

    // Update fields
    if (name) user.name = name;
    if (password) user.passwordHash = password;

    await user.save();

    // Return updated user data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(createSuccessResponse(userResponse, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};



export {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,

};
