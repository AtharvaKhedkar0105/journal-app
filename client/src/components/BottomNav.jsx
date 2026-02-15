import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  BookOpen,
  Plus,
  User,
  Moon,
  Sun,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../lib/utils'

function BottomNav({ user, theme, toggleTheme }) {
  const location = useLocation()
  const { logoutMutation } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Entries', href: '/entries', icon: BookOpen },
    { name: 'New', href: '/new-entry', icon: Plus },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    if (href === '/entries') return location.pathname.startsWith('/entries')
    return location.pathname === href
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-5 gap-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors',
                active
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="truncate">{item.name}</span>
              {active && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="w-1 h-1 bg-primary-600 rounded-full mt-1"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center py-2 px-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 mb-1" />
          ) : (
            <Sun className="w-5 h-5 mb-1" />
          )}
          <span>Theme</span>
        </button>
      </div>
    </div>
  )
}

export default BottomNav
