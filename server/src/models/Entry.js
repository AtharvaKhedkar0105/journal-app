import mongoose from 'mongoose';

const moodSchema = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANXIOUS: 'anxious',
  GRATEFUL: 'grateful',
  EXCITED: 'excited',
  CALM: 'calm',
  FRUSTRATED: 'frustrated',
  NEUTRAL: 'neutral'
};

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  mood: {
    type: String,
    enum: Object.values(moodSchema),
    required: [true, 'Mood is required']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  entryDate: {
    type: Date,
    required: [true, 'Entry date is required'],
    default: Date.now
  },
  pinned: {
    type: Boolean,
    default: false
  },
  favorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
entrySchema.index({ userId: 1, entryDate: -1 });
entrySchema.index({ userId: 1, mood: 1 });
entrySchema.index({ userId: 1, tags: 1 });

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;
