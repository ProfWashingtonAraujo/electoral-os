import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/useAuthStore'
import { ROUTES } from '../constants/routes'

export function DefaultRouteRedirect() {
  const user = useAuthStore((s) => s.user)

  if (user?.role === 'digitador') {
    return <Navigate to={ROUTES.VOTERS_NEW} replace />
  }

  return <Navigate to={ROUTES.DASHBOARD} replace />
}
