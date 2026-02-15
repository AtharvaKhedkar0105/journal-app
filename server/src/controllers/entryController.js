import { createSuccessResponse, createErrorResponse } from '../utils/response.js';
import Entry from '../models/Entry.js';

// Create entry
const createEntry = async (req, res, next) => {
  try {
    console.log('Create entry request body:', req.body);
    console.log('Create entry user:', req.user);
    
    const { title, content, mood, tags, entryDate } = req.body;
    
    if (!req.user) {
      console.error('No user in request');
      return res.status(401).json(createErrorResponse('User not authenticated'));
    }
    
    const entry = new Entry({
      userId: req.user._id,
      title,
      content,
      mood,
      tags: tags || [],
      entryDate: entryDate ? new Date(entryDate) : new Date()
    });

    console.log('Entry object created:', entry);
    await entry.save();
    await entry.populate('userId', 'name email');

    console.log('Entry saved successfully');
    res.status(201).json(createSuccessResponse(entry, 'Entry created successfully'));
  } catch (error) {
    console.error('Create entry error:', error);
    next(error);
  }
};

// Get all entries with filters and pagination
const getEntries = async (req, res, next) => {
  try {
    const {
      search = '',
      mood = '',
      tag = '',
      from = '',
      to = '',
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Mood filter
    if (mood) {
      query.mood = mood;
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Date range filter
    if (from || to) {
      query.entryDate = {};
      if (from) query.entryDate.$gte = new Date(from);
      if (to) query.entryDate.$lte = new Date(to);
    }

    // Sort options
    let sortOptions = {};
    switch (sort) {
      case 'oldest':
        sortOptions.entryDate = 1;
        break;
      case 'newest':
      default:
        sortOptions.entryDate = -1;
        break;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [entries, total] = await Promise.all([
      Entry.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('userId', 'name email'),
      Entry.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(createSuccessResponse({
      entries,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalEntries: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    }, 'Entries retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Get single entry
const getEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entry = await Entry.findOne({ _id: id, userId: req.user._id })
      .populate('userId', 'name email');

    if (!entry) {
      return res.status(404).json(createErrorResponse('Entry not found'));
    }

    res.json(createSuccessResponse(entry, 'Entry retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// Update entry
const updateEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, mood, tags, entryDate } = req.body;

    const entry = await Entry.findOne({ _id: id, userId: req.user._id });
    if (!entry) {
      return res.status(404).json(createErrorResponse('Entry not found'));
    }

    // Update fields
    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (mood !== undefined) entry.mood = mood;
    if (tags !== undefined) entry.tags = tags;
    if (entryDate !== undefined) entry.entryDate = new Date(entryDate);

    await entry.save();
    await entry.populate('userId', 'name email');

    res.json(createSuccessResponse(entry, 'Entry updated successfully'));
  } catch (error) {
    next(error);
  }
};

// Delete entry
const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entry = await Entry.findOne({ _id: id, userId: req.user._id });
    if (!entry) {
      return res.status(404).json(createErrorResponse('Entry not found'));
    }

    await Entry.findByIdAndDelete(id);

    res.json(createSuccessResponse(null, 'Entry deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// Toggle pin entry
const togglePin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entry = await Entry.findOne({ _id: id, userId: req.user._id });
    if (!entry) {
      return res.status(404).json(createErrorResponse('Entry not found'));
    }

    entry.pinned = !entry.pinned;
    await entry.save();

    res.json(createSuccessResponse(
      { pinned: entry.pinned },
      entry.pinned ? 'Entry pinned successfully' : 'Entry unpinned successfully'
    ));
  } catch (error) {
    next(error);
  }
};

// Toggle favorite entry
const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entry = await Entry.findOne({ _id: id, userId: req.user._id });
    if (!entry) {
      return res.status(404).json(createErrorResponse('Entry not found'));
    }

    entry.favorite = !entry.favorite;
    await entry.save();

    res.json(createSuccessResponse(
      { favorite: entry.favorite },
      entry.favorite ? 'Entry favorited successfully' : 'Entry unfavorited successfully'
    ));
  } catch (error) {
    next(error);
  }
};

export {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  togglePin,
  toggleFavorite
};
