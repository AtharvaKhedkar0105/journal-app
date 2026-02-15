import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Heart,
  Pin,
  TrendingUp,
  Calendar,
  Plus,
  BarChart3,
} from 'lucide-react'
import { useAnalyticsSummary, useMoodWeekly, useStreak } from '../hooks/useAnalytics'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMoodColor, getMoodEmoji, formatShortDate } from '../lib/utils'
import { MOODS } from '../lib/constants'

function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary()
  const { data: moodWeekly, isLoading: moodLoading } = useMoodWeekly()
  const { data: streak, isLoading: streakLoading } = useStreak()

  const isLoading = summaryLoading || moodLoading || streakLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const summaryCards = [
    {
      title: 'Total Entries',
      value: summary?.totalEntries || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Favorites',
      value: summary?.favoriteEntries || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Pinned',
      value: summary?.pinnedEntries || 0,
      icon: Pin,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: 'This Week',
      value: summary?.thisWeekEntries || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
  ]

  const getMoodData = () => {
    if (!moodWeekly || moodWeekly.length === 0) return []

    return moodWeekly.map(day => ({
      date: formatShortDate(day.date),
      dominantMood: day.moods.length > 0
        ? day.moods.reduce((prev, current) =>
          prev.count > current.count ? prev : current
        ).mood
        : null
    }))
  }

  const moodData = getMoodData()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your journaling overview.
          </p>
        </div>
        <Link
          to="/new-entry"
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Streak and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Journaling Streak
            </h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {streak?.currentStreak || 0} days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {streak?.longestStreak || 0} days
              </p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Mood Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              This Week's Mood
            </h3>
            <BarChart3 className="w-5 h-5 text-primary-600" />
          </div>
          <div className="space-y-3">
            {moodData.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {day.date}
                </span>
                {day.dominantMood ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getMoodEmoji(day.dominantMood)}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${getMoodColor(day.dominantMood)}`} />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No entry</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/new-entry"
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
              Write New Entry
            </span>
          </Link>
          <Link
            to="/entries"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Browse Entries
            </span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              View Analytics
            </span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPage
