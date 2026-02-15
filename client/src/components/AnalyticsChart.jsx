import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getMoodColor, getMoodEmoji } from '../lib/utils'
import { MOODS } from '../lib/constants'

function AnalyticsChart({ data, title }) {
  const getMoodData = () => {
    const moodCounts = {}
    
    data.forEach(day => {
      day.moods.forEach(moodObj => {
        if (!moodCounts[moodObj.mood]) {
          moodCounts[moodObj.mood] = 0
        }
        moodCounts[moodObj.mood] += moodObj.count
      })
    })

    return Object.entries(moodCounts).map(([mood, count]) => {
      const moodInfo = MOODS.find(m => m.value === mood)
      return {
        mood: moodInfo?.label || mood,
        emoji: moodInfo?.emoji || '😐',
        count,
        color: getMoodColor(mood),
      }
    }).sort((a, b) => b.count - a.count)
  }

  const chartData = getMoodData()

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{data.emoji}</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.mood}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.count} {data.count === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      {chartData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="emoji" 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color.replace('bg-', '#').replace('text-', '#')} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default AnalyticsChart
