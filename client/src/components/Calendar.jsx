import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCalendar } from '../hooks/useAnalytics'
import LoadingSpinner from './LoadingSpinner'
import { getMoodColor, getMoodEmoji } from '../lib/utils'

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { data: calendarData, isLoading } = useCalendar(format(currentMonth, 'yyyy-MM'))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const startDayOfWeek = getDay(monthStart)
  const emptyDays = Array(startDayOfWeek).fill(null)

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  const getDayData = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    return calendarData?.[dateStr]
  }

  const getDayMood = (day) => {
    const dayData = getDayData(day)
    if (!dayData || dayData.moods.length === 0) return null
    
    // Get the most frequent mood
    const moodCounts = {}
    dayData.moods.forEach(mood => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1
    })
    
    const dominantMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0][0]
    
    return dominantMood
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Journal Calendar
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty days for month start */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        
        {/* Actual days */}
        {monthDays.map(day => {
          const dayData = getDayData(day)
          const dominantMood = getDayMood(day)
          const isToday = isSameDay(day, new Date())
          
          return (
            <div
              key={day.toISOString()}
              className={`
                aspect-square border rounded-lg p-1 flex flex-col items-center justify-center
                transition-all hover:shadow-md cursor-pointer
                ${isToday ? 'ring-2 ring-primary-500' : ''}
                ${dayData ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700'}
              `}
            >
              <span className={`text-xs font-medium ${isToday ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'}`}>
                {format(day, 'd')}
              </span>
              
              {dominantMood && (
                <div className="mt-1">
                  <span className="text-lg">{getMoodEmoji(dominantMood)}</span>
                </div>
              )}
              
              {dayData && dayData.count > 1 && (
                <div className={`w-2 h-2 rounded-full ${getMoodColor(dominantMood)} mt-1`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Mood indicators:</p>
        <div className="flex flex-wrap gap-2">
          {['happy', 'sad', 'anxious', 'grateful', 'excited', 'calm', 'frustrated', 'neutral'].map(mood => (
            <div key={mood} className="flex items-center space-x-1">
              <span className="text-sm">{getMoodEmoji(mood)}</span>
              <div className={`w-2 h-2 rounded-full ${getMoodColor(mood)}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar
