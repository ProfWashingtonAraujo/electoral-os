import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/useAuthStore'
import { ROUTES } from '../constants/routes'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  return <Outlet />
}
