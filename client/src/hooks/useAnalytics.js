import { useQuery } from '@tanstack/react-query'
import { analyticsAPI } from '../api/analytics'

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const response = await analyticsAPI.getSummary()
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useMoodWeekly() {
  return useQuery({
    queryKey: ['analytics', 'mood-weekly'],
    queryFn: async () => {
      const response = await analyticsAPI.getMoodWeekly()
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useStreak() {
  return useQuery({
    queryKey: ['analytics', 'streak'],
    queryFn: async () => {
      const response = await analyticsAPI.getStreak()
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCalendar(month) {
  return useQuery({
    queryKey: ['analytics', 'calendar', month],
    queryFn: async () => {
      const response = await analyticsAPI.getCalendar(month)
      return response.data.data
    },
    enabled: !!month,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
