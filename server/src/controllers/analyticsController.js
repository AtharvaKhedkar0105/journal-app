import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import Entry from '../models/Entry.js';

// Get analytics summary
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      totalEntries,
      favoriteEntries,
      pinnedEntries,
      thisWeekEntries
    ] = await Promise.all([
      Entry.countDocuments({ userId }),
      Entry.countDocuments({ userId, favorite: true }),
      Entry.countDocuments({ userId, pinned: true }),
      Entry.countDocuments({
        userId,
        entryDate: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      })
    ]);

    const summary = {
      totalEntries,
      favoriteEntries,
      pinnedEntries,
      thisWeekEntries
    };

    res.json(createSuccessResponse(summary, 'Analytics summary retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Get weekly mood analytics
const getMoodWeekly = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

    const moodData = await Entry.aggregate([
      {
        $match: {
          userId: userId,
          entryDate: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$entryDate" } },
            mood: "$mood"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          moods: {
            $push: {
              mood: "$_id.mood",
              count: "$count"
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Fill missing days with empty mood data
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(new Date().setDate(new Date().getDate() - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = moodData.find(item => item._id === dateStr);
      weeklyData.push({
        date: dateStr,
        moods: dayData ? dayData.moods : []
      });
    }

    res.json(createSuccessResponse(weeklyData, 'Weekly mood analytics retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Get journaling streak
const getStreak = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all entry dates sorted descending
    const entries = await Entry.find({ userId })
      .select('entryDate')
      .sort({ entryDate: -1 });

    if (entries.length === 0) {
      return res.json(createSuccessResponse({ currentStreak: 0, longestStreak: 0 }, 'Streak data retrieved successfully'));
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let checkDate = new Date(today);
    let foundEntry = false;

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].entryDate);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === checkDate.getTime() || 
          (foundEntry && entryDate.getTime() === checkDate.getTime())) {
        currentStreak++;
        foundEntry = true;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (entryDate.getTime() < checkDate.getTime()) {
        break;
      }
    }

    // Calculate longest streak
    const uniqueDates = [...new Set(entries.map(e => 
      new Date(e.entryDate).setHours(0, 0, 0, 0)
    ))].sort((a, b) => b - a);

    tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const prevDate = new Date(uniqueDates[i - 1]);
      const diffTime = Math.abs(prevDate - currentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const streakData = {
      currentStreak,
      longestStreak
    };

    res.json(createSuccessResponse(streakData, 'Streak data retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Get calendar data for a month
const getCalendar = async (req, res, next) => {
  try {
    const { month } = req.query; // Format: YYYY-MM
    const userId = req.user._id;

    if (!month) {
      return res.status(400).json(createErrorResponse('Month parameter is required (YYYY-MM)'));
    }

    // Parse month and get date range
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of month

    const entries = await Entry.find({
      userId,
      entryDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).select('entryDate mood');

    // Group entries by date
    const calendarData = {};
    entries.forEach(entry => {
      const dateStr = new Date(entry.entryDate).toISOString().split('T')[0];
      if (!calendarData[dateStr]) {
        calendarData[dateStr] = {
          count: 0,
          moods: []
        };
      }
      calendarData[dateStr].count++;
      calendarData[dateStr].moods.push(entry.mood);
    });

    res.json(createSuccessResponse(calendarData, 'Calendar data retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export {
  getSummary,
  getMoodWeekly,
  getStreak,
  getCalendar
};
