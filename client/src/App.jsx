import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import Layout from './components/Layout'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import LoadingSpinner from './components/LoadingSpinner'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EntriesPage from './pages/EntriesPage'
import EntryPage from './pages/EntryPage'
import NewEntryPage from './pages/NewEntryPage'
import EditEntryPage from './pages/EditEntryPage'
import ProfilePage from './pages/ProfilePage'
import AnalyticsPage from './pages/AnalyticsPage'

import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { data: user, isLoading, error } = useUser()
  const { theme } = useTheme()

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      <KeyboardShortcuts />
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />


        {/* Protected routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="entries"
            element={user ? <EntriesPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="entries/:id"
            element={user ? <EntryPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="entries/:id/edit"
            element={user ? <EditEntryPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="new-entry"
            element={user ? <NewEntryPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="analytics"
            element={user ? <AnalyticsPage /> : <Navigate to="/login" replace />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
