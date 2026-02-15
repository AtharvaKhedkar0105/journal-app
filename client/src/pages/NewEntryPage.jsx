import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  Save,
  Eye,
  EyeOff,
  X,
  Plus,
  Hash,
  Calendar,
  Smile,
} from 'lucide-react'
import { useCreateEntry } from '../hooks/useEntries'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { MOODS } from '../lib/constants'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMoodEmoji, getMoodColor } from '../lib/utils'

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be less than 5000 characters'),
  mood: z.enum(['happy', 'sad', 'anxious', 'grateful', 'excited', 'calm', 'frustrated', 'neutral']),
  tags: z.array(z.string().max(20, 'Tag must be less than 20 characters')).max(10, 'Maximum 10 tags allowed'),
  entryDate: z.string().optional(),
})

function NewEntryPage() {
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [draft, setDraft] = useLocalStorage('journal_draft', {})
  const createEntryMutation = useCreateEntry()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: draft.title || '',
      content: draft.content || '',
      mood: draft.mood || 'neutral',
      tags: draft.tags || [],
      entryDate: draft.entryDate || new Date().toISOString().split('T')[0],
    },
  })

  const watchedValues = watch()
  const selectedMood = watchedValues.mood
  const selectedTags = watchedValues.tags || []

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchedValues.title || watchedValues.content) {
        setDraft({
          title: watchedValues.title,
          content: watchedValues.content,
          mood: watchedValues.mood,
          tags: watchedValues.tags,
          entryDate: watchedValues.entryDate,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [watchedValues, setDraft])

  const addTag = () => {
    if (tagInput.trim() && selectedTags.length < 10 && !selectedTags.includes(tagInput.trim())) {
      setValue('tags', [...selectedTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setValue('tags', selectedTags.filter(tag => tag !== tagToRemove))
  }

  const onSubmit = (data) => {
    console.log('Submitting Entry Data:', data);
    createEntryMutation.mutate(data, {
      onSuccess: () => {
        console.log('Entry creation success');
        setDraft({}) // Clear draft after successful submission
        navigate('/entries')
      },
      onError: (error) => {
        console.error('Entry creation failed:', error);
        console.error('Error Response:', error.response?.data);
      }
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          New Journal Entry
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Express yourself and document your thoughts
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                {...register('title')}
                type="text"
                className="input"
                placeholder="Give your entry a title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn-ghost text-sm"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </>
                  )}
                </button>
              </div>

              {showPreview ? (
                <div className="min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-lg font-semibold mb-3">{watchedValues.title || 'Untitled'}</h3>
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {watchedValues.content || 'Start writing to see preview...'}
                    </div>
                  </div>
                </div>
              ) : (
                <textarea
                  {...register('content')}
                  rows={12}
                  className="textarea"
                  placeholder="What's on your mind today?"
                />
              )}
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="input pl-10"
                      placeholder="Add tags..."
                      disabled={selectedTags.length >= 10}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim() || selectedTags.length >= 10}
                    className="btn-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Date */}
            <div>
              <label htmlFor="entryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Entry Date
              </label>
              <input
                {...register('entryDate')}
                type="date"
                className="input"
              />
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Smile className="w-4 h-4 inline mr-1" />
                How are you feeling?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOODS.map((mood) => (
                  <label
                    key={mood.value}
                    className={`
                      relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors
                      ${selectedMood === mood.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }
                    `}
                  >
                    <input
                      {...register('mood')}
                      type="radio"
                      value={mood.value}
                      className="sr-only"
                    />
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {mood.label}
                    </span>
                    {selectedMood === mood.value && (
                      <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getMoodColor(mood.value)}`} />
                    )}
                  </label>
                ))}
              </div>
              {errors.mood && (
                <p className="mt-1 text-sm text-red-600">{errors.mood.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={createEntryMutation.isPending}
                className="w-full btn-primary"
              >
                {createEntryMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Entry
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/entries')}
                className="w-full btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  )
}

export default NewEntryPage
