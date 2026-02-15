import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Edit,
  Heart,
  Pin,
  Calendar,
  Hash,
  Trash2,
} from 'lucide-react'
import { useEntry, useTogglePin, useToggleFavorite, useDeleteEntry } from '../hooks/useEntries'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate, getMoodEmoji, getMoodColor } from '../lib/utils'

function EntryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: entry, isLoading, error } = useEntry(id)
  const togglePinMutation = useTogglePin()
  const toggleFavoriteMutation = useToggleFavorite()
  const deleteEntryMutation = useDeleteEntry()

  const handleTogglePin = () => {
    togglePinMutation.mutate(id)
  }

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate(id)
  }

  const handleDelete = () => {
    deleteEntryMutation.mutate(id, {
      onSuccess: () => {
        navigate('/entries')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Entry not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The entry you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/entries" className="btn-primary">
          Back to Entries
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/entries"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Entries
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
              <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood)}`} />
              {entry.pinned && (
                <Pin className="w-5 h-5 text-yellow-500 fill-current" />
              )}
              {entry.favorite && (
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {entry.title}
            </h1>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(entry.entryDate)}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Link
              to={`/entries/${id}/edit`}
              className="btn-secondary"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={handleToggleFavorite}
              className="btn-secondary"
              disabled={toggleFavoriteMutation.isPending}
            >
              <Heart
                className={`w-4 h-4 ${entry.favorite ? 'text-red-500 fill-current' : ''}`}
              />
            </button>
            <button
              onClick={handleTogglePin}
              className="btn-secondary"
              disabled={togglePinMutation.isPending}
            >
              <Pin
                className={`w-4 h-4 ${entry.pinned ? 'text-yellow-500 fill-current' : ''}`}
              />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-secondary text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card p-8">
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {entry.content}
          </div>
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Entry
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete "{entry.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
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
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default EntryPage
