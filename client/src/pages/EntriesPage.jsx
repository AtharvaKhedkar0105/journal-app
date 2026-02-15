import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Plus,
  Heart,
  Pin,
  Calendar,
  ChevronDown,
  X,
} from 'lucide-react'
import { useEntries } from '../hooks/useEntries'
import { useTogglePin, useToggleFavorite, useDeleteEntry } from '../hooks/useEntries'
import { MOODS, SORT_OPTIONS, ENTRIES_PER_PAGE } from '../lib/constants'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatRelativeTime, getMoodEmoji, getMoodColor, truncateText } from '../lib/utils'
import { debounce } from '../lib/utils'

function EntriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    mood: '',
    tag: '',
    from: '',
    to: '',
    sort: 'newest',
    page: 1,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(null)

  const { data: entriesData, isLoading, error } = useEntries({
    search: searchTerm,
    ...filters,
  })

  const togglePinMutation = useTogglePin()
  const toggleFavoriteMutation = useToggleFavorite()
  const deleteEntryMutation = useDeleteEntry()

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value)
    setFilters(prev => ({ ...prev, page: 1 }))
  }, 300)

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleTogglePin = (id) => {
    togglePinMutation.mutate(id)
  }

  const handleToggleFavorite = (id) => {
    toggleFavoriteMutation.mutate(id)
  }

  const handleDelete = (id) => {
    deleteEntryMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteModal(null)
      },
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      mood: '',
      tag: '',
      from: '',
      to: '',
      sort: 'newest',
      page: 1,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load entries</p>
      </div>
    )
  }

  const { entries, pagination } = entriesData || { entries: [], pagination: {} }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Journal Entries
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {pagination.totalEntries || 0} entries total
          </p>
        </div>
        <Link to="/new-entry" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Mood Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mood
                </label>
                <select
                  value={filters.mood}
                  onChange={(e) => handleFilterChange('mood', e.target.value)}
                  className="input"
                >
                  <option value="">All moods</option>
                  {MOODS.map(mood => (
                    <option key={mood.value} value={mood.value}>
                      {mood.emoji} {mood.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => handleFilterChange('from', e.target.value)}
                  className="input"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => handleFilterChange('to', e.target.value)}
                  className="input"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="input"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <button onClick={clearFilters} className="btn-ghost text-sm">
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Entries Grid */}
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No entries found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filters.mood || filters.from || filters.to
              ? 'Try adjusting your search or filters'
              : 'Start by creating your first journal entry'
            }
          </p>
          <Link to="/new-entry" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Entry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`card p-6 relative ${entry.pinned ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {/* Pin Indicator */}
              {entry.pinned && (
                <div className="absolute top-2 right-2">
                  <Pin className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                  <div className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)}`} />
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleFavorite(entry._id)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={toggleFavoriteMutation.isPending}
                  >
                    <Heart
                      className={`w-4 h-4 ${entry.favorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    />
                  </button>
                  <button
                    onClick={() => handleTogglePin(entry._id)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={togglePinMutation.isPending}
                  >
                    <Pin
                      className={`w-4 h-4 ${entry.pinned ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {entry.title}
              </h3>

              {/* Content */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                {truncateText(entry.content, 120)}
              </p>

              {/* Tags */}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {entry.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {entry.tags.length > 3 && (
                    <span className="inline-block px-2 py-1 text-xs text-gray-500">
                      +{entry.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatRelativeTime(entry.entryDate)}</span>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/entries/${entry._id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Read more
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(entry._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="btn-secondary disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="btn-secondary disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Entry
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete this entry? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deleteEntryMutation.isPending}
                className="flex-1 btn-primary bg-red-600 hover:bg-red-700"
              >
                {deleteEntryMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Delete'
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default EntriesPage
