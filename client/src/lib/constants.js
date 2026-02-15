export const MOODS = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏' },
  { value: 'excited', label: 'Excited', emoji: '🎉' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😤' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
]

export const ENTRIES_PER_PAGE = 10

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const DRAFT_KEY = 'journal_draft'

export const THEME_KEY = 'journal_theme'
