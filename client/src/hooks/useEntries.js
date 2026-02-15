import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { entriesAPI } from '../api/entries'
import toast from 'react-hot-toast'

export function useEntries(params = {}) {
  return useQuery({
    queryKey: ['entries', params],
    queryFn: async () => {
      const response = await entriesAPI.getEntries(params)
      return response.data.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useEntry(id) {
  return useQuery({
    queryKey: ['entry', id],
    queryFn: async () => {
      const response = await entriesAPI.getEntry(id)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: entriesAPI.createEntry,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      toast.success('Entry created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create entry')
    },
  })
}

export function useUpdateEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }) => entriesAPI.updateEntry(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['entry', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      toast.success('Entry updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update entry')
    },
  })
}

export function useDeleteEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: entriesAPI.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      toast.success('Entry deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete entry')
    },
  })
}

export function useTogglePin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: entriesAPI.togglePin,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['entry', variables] })
      const message = response.data.data.pinned ? 'Entry pinned!' : 'Entry unpinned!'
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to toggle pin')
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: entriesAPI.toggleFavorite,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      queryClient.invalidateQueries({ queryKey: ['entry', variables] })
      const message = response.data.data.favorite ? 'Entry favorited!' : 'Entry unfavorited!'
      toast.success(message)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to toggle favorite')
    },
  })
}
