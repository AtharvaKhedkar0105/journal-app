import { Outlet, Navigate } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import LoadingSpinner from './LoadingSpinner'

function Layout() {
  const { data: user, isLoading } = useUser()
  const { theme, toggleTheme } = useTheme()

  // Check if user has a token (more reliable than useUser data)
  const hasToken = localStorage.getItem('accessToken')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user && !hasToken) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar user={user} theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav user={user} theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pb-16 lg:pb-0">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
