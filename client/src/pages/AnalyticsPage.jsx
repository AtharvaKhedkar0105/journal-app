import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  TrendingUp,
  BarChart3,
  Heart,
  BookOpen,
  Pin,
} from 'lucide-react'
import { useAnalyticsSummary, useMoodWeekly, useStreak } from '../hooks/useAnalytics'
import AnalyticsChart from '../components/AnalyticsChart'
import Calendar from '../components/Calendar'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMoodEmoji, getMoodColor } from '../lib/utils'

function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary()
  const { data: moodWeekly, isLoading: moodLoading } = useMoodWeekly()
  const { data: streak, isLoading: streakLoading } = useStreak()

  const isLoading = summaryLoading || moodLoading || streakLoading

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'moods', label: 'Mood Analysis', icon: Heart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const getMoodInsights = () => {
    if (!moodWeekly || moodWeekly.length === 0) return []
    
    const moodCounts = {}
    moodWeekly.forEach(day => {
      day.moods.forEach(moodObj => {
        moodCounts[moodObj.mood] = (moodCounts[moodObj.mood] || 0) + moodObj.count
      })
    })

    return Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        emoji: getMoodEmoji(mood),
        count,
        percentage: Math.round((count / Object.values(moodCounts).reduce((a, b) => a + b, 0)) * 100)
      }))
      .sort((a, b) => b.count - a.count)
  }

  const moodInsights = getMoodInsights()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your journaling patterns and emotional journey
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Entries
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summary?.totalEntries || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Favorites
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summary?.favoriteEntries || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                    <Pin className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pinned
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summary?.pinnedEntries || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Current Streak
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {streak?.currentStreak || 0} days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChart 
                data={moodWeekly || []} 
                title="Weekly Mood Distribution" 
              />
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Moods This Week
                </h3>
                {moodInsights.length > 0 ? (
                  <div className="space-y-3">
                    {moodInsights.slice(0, 5).map((insight, index) => (
                      <div key={insight.mood} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{insight.emoji}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {insight.mood}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getMoodColor(insight.mood)}`}
                              style={{ width: `${insight.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                            {insight.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No mood data available
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'moods' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <AnalyticsChart 
              data={moodWeekly || []} 
              title="Mood Trends - Last 7 Days" 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Emotional Patterns
                </h3>
                {moodInsights.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Most frequent mood:</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{moodInsights[0].emoji}</span>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {moodInsights[0].mood}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({moodInsights[0].count} times)
                        </span>
                      </div>
                    </div>
                    
                    {moodInsights.length > 1 && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Least frequent mood:</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{moodInsights[moodInsights.length - 1].emoji}</span>
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {moodInsights[moodInsights.length - 1].mood}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({moodInsights[moodInsights.length - 1].count} times)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No mood data available
                  </p>
                )}
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Daily Mood Summary
                </h3>
                {moodWeekly && moodWeekly.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {moodWeekly.map((day, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center space-x-1">
                          {day.moods.map((moodObj, moodIndex) => (
                            <span key={moodIndex} className="text-lg" title={`${moodObj.mood} (${moodObj.count})`}>
                              {getMoodEmoji(moodObj.mood)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No daily mood data available
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Calendar />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default AnalyticsPage
