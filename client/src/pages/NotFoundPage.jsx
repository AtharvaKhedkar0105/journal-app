import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen, ArrowLeft } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Page not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          
          <Link
            to="/entries"
            className="btn-secondary inline-flex items-center justify-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            My Entries
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-ghost inline-flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
