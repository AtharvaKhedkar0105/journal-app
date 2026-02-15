import api from './axios'

export const entriesAPI = {
  getEntries: (params) => api.get('/entries', { params }),
  getEntry: (id) => api.get(`/entries/${id}`),
  createEntry: (entryData) => api.post('/entries', entryData),
  updateEntry: (id, entryData) => api.put(`/entries/${id}`, entryData),
  deleteEntry: (id) => api.delete(`/entries/${id}`),
  togglePin: (id) => api.patch(`/entries/${id}/pin`),
  toggleFavorite: (id) => api.patch(`/entries/${id}/favorite`),
}
