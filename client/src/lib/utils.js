import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatShortDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

export function getMoodColor(mood) {
  const colors = {
    happy: 'bg-mood-happy',
    sad: 'bg-mood-sad',
    anxious: 'bg-mood-anxious',
    grateful: 'bg-mood-grateful',
    excited: 'bg-mood-excited',
    calm: 'bg-mood-calm',
    frustrated: 'bg-mood-frustrated',
    neutral: 'bg-mood-neutral',
  }
  return colors[mood] || 'bg-gray-400'
}

export function getMoodEmoji(mood) {
  const emojis = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    grateful: '🙏',
    excited: '🎉',
    calm: '😌',
    frustrated: '😤',
    neutral: '😐',
  }
  return emojis[mood] || '😐'
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
