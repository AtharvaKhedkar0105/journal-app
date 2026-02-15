import express from 'express';
import {
  getSummary,
  getMoodWeekly,
  getStreak,
  getCalendar
} from '../controllers/analyticsController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/summary', getSummary);
router.get('/mood-weekly', getMoodWeekly);
router.get('/streak', getStreak);
router.get('/calendar', getCalendar);

export default router;
