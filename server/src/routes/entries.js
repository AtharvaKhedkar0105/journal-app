import express from 'express';
import {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  togglePin,
  toggleFavorite
} from '../controllers/entryController.js';
import { validate } from '../middleware/validation.js';
import { entrySchema, updateEntrySchema } from '../middleware/validation.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.post('/', validate(entrySchema), createEntry);
router.get('/', getEntries);
router.get('/:id', getEntry);
router.put('/:id', validate(updateEntrySchema), updateEntry);
router.delete('/:id', deleteEntry);
router.patch('/:id/pin', togglePin);
router.patch('/:id/favorite', toggleFavorite);

export default router;
