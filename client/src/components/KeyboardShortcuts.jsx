import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function KeyboardShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when user is typing in input fields
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.contentEditable === 'true'
      ) {
        return
      }

      // Ctrl/Cmd + K for search (global)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]')
        if (searchInput) {
          searchInput.focus()
        }
      }

      // N for new entry
      if (event.key === 'n' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        navigate('/new-entry')
      }

      // / for search
      if (event.key === '/' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]')
        if (searchInput) {
          searchInput.focus()
        }
      }

      // G for dashboard (home)
      if (event.key === 'g' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        navigate('/dashboard')
      }

      // E for entries
      if (event.key === 'e' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        navigate('/entries')
      }

      // A for analytics
      if (event.key === 'a' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        navigate('/profile')
      }

      // Escape to close modals or go back
      if (event.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]')
        if (modals.length > 0) {
          // Close the last modal
          const lastModal = modals[modals.length - 1]
          const closeButton = lastModal.querySelector('button[aria-label="Close"], button[type="button"]')
          if (closeButton) {
            closeButton.click()
          }
        } else {
          // Go back in history
          window.history.back()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return null
}

export default KeyboardShortcuts
