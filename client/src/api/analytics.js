import api from './axios'

export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getMoodWeekly: () => api.get('/analytics/mood-weekly'),
  getStreak: () => api.get('/analytics/streak'),
  getCalendar: (month) => api.get('/analytics/calendar', { params: { month } }),
}
