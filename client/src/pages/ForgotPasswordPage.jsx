import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, BookOpen } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { forgotPasswordMutation } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate(data.email, {
      onSuccess: () => {
        setIsSubmitted(true)
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We'll send you a link to reset your password
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg"
        >
          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className="input pl-10"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  className="w-full btn-primary py-2 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotPasswordMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Sending reset link...
                    </div>
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                If an account exists with that email, you'll receive a password reset link shortly.
              </p>
            </div>
          )}

          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage
