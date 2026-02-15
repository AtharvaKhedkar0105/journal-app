import { z } from 'zod';
import { createErrorResponse } from '../utils/response.js';

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional()
}).refine(data => data.name || data.password, {
  message: 'At least one field (name or password) must be provided'
});

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content cannot exceed 5000 characters'),
  mood: z.enum(['happy', 'sad', 'anxious', 'grateful', 'excited', 'calm', 'frustrated', 'neutral']),
  tags: z.array(z.string().max(20, 'Tag cannot exceed 20 characters')).max(10, 'Cannot have more than 10 tags').optional(),
  entryDate: z.string().optional().or(z.date()).optional().transform(val => {
    if (!val) return new Date();
    if (val instanceof Date) return val;
    // Handle YYYY-MM-DD format from date input
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return new Date(val + 'T00:00:00.000Z');
    }
    return new Date(val);
  })
});

const updateEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').optional(),
  content: z.string().min(1, 'Content is required').max(5000, 'Content cannot exceed 5000 characters').optional(),
  mood: z.enum(['happy', 'sad', 'anxious', 'grateful', 'excited', 'calm', 'frustrated', 'neutral']).optional(),
  tags: z.array(z.string().max(20, 'Tag cannot exceed 20 characters')).max(10, 'Cannot have more than 10 tags').optional(),
  entryDate: z.string().optional().transform(val => {
    if (!val) return undefined;
    // Handle YYYY-MM-DD format from date input
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return new Date(val + 'T00:00:00.000Z');
    }
    return new Date(val);
  })
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Validation middleware factory
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = source === 'body' ? req.body : 
                   source === 'query' ? req.query : 
                   req.params;
      
      const validatedData = schema.parse(data);
      
      // Replace the request data with validated data
      if (source === 'body') req.body = validatedData;
      else if (source === 'query') req.query = validatedData;
      else req.params = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json(createErrorResponse('Validation failed', errors));
      }
      return res.status(500).json(createErrorResponse('Validation error'));
    }
  };
};

export {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  entrySchema,
  updateEntrySchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
