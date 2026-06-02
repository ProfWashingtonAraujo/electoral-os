import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/useAuthStore'
import { ROUTES } from '../constants/routes'

// Prevent accessing guest-only pages (like /login) when authenticated.
export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />
  return <Outlet />
}
