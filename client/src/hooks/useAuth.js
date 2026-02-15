import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authAPI } from '../api/auth'
import toast from 'react-hot-toast'

export function useAuth() {
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { user, accessToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      queryClient.setQueryData(['user'], user)
      toast.success('Welcome back!')
    },
  })

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      const { user, accessToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      queryClient.setQueryData(['user'], user)
      toast.success('Account created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('accessToken')
      queryClient.setQueryData(['user'], null)
      queryClient.clear()
      toast.success('Logged out successfully')
    },
    onError: (error) => {
      localStorage.removeItem('accessToken')
      queryClient.setQueryData(['user'], null)
      queryClient.clear()
      toast.error('Logout failed')
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (response) => {
      queryClient.setQueryData(['user'], response.data.data)
      toast.success('Profile updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Profile update failed')
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: authAPI.forgotPassword,
    onSuccess: () => {
      toast.success('If an account exists, you will receive a reset link')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }) => authAPI.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password reset successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Password reset failed')
    },
  })

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
    updateProfileMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  }
}

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('No token found')
      }
      const response = await authAPI.getMe()
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: !!localStorage.getItem('accessToken'),
  })
}
