import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  BookOpen,
  Plus,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../lib/utils'

function Sidebar({ user, theme, toggleTheme }) {
  const location = useLocation()
  const { logoutMutation } = useAuth()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Entries', href: '/entries', icon: BookOpen },
    { name: 'New Entry', href: '/new-entry', icon: Plus },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    if (href === '/entries') return location.pathname.startsWith('/entries')
    return location.pathname === href
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <BookOpen className="w-8 h-8 text-primary-600" />
          <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
            Daily Journal
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                active
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-2 w-1 h-6 bg-primary-600 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 mr-3" />
            ) : (
              <Sun className="w-5 h-5 mr-3" />
            )}
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>

          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
