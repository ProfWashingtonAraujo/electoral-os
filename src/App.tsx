import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { ToastContainer } from './components/feedback/Toast'
import { useAuthStore } from './modules/auth/useAuthStore'

const LAST_ACTIVITY_KEY = 'electoral_last_activity'
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000

function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem(LAST_ACTIVITY_KEY)
      return
    }

    let timeoutId: number | null = null

    const readLastActivity = () => Number(sessionStorage.getItem(LAST_ACTIVITY_KEY) ?? Date.now())

    const scheduleLogoutCheck = (lastActivity = readLastActivity()) => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }

      const remainingTime = Math.max(INACTIVITY_LIMIT_MS - (Date.now() - lastActivity), 0)
      timeoutId = window.setTimeout(() => {
        const elapsed = Date.now() - readLastActivity()
        if (elapsed >= INACTIVITY_LIMIT_MS) {
          logout()
        } else {
          scheduleLogoutCheck()
        }
      }, remainingTime)
    }

    const registerActivity = () => {
      const now = Date.now()
      sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now))
      scheduleLogoutCheck(now)
    }

    const checkInactivity = () => {
      if (Date.now() - readLastActivity() >= INACTIVITY_LIMIT_MS) {
        logout()
        return
      }

      scheduleLogoutCheck()
    }

    if (!sessionStorage.getItem(LAST_ACTIVITY_KEY)) {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
    }

    scheduleLogoutCheck()

    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll', 'focus']
    for (const eventName of events) {
      window.addEventListener(eventName, registerActivity, { passive: true })
    }

    document.addEventListener('visibilitychange', checkInactivity)

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }

      for (const eventName of events) {
        window.removeEventListener(eventName, registerActivity)
      }

      document.removeEventListener('visibilitychange', checkInactivity)
    }
  }, [isAuthenticated, logout])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
