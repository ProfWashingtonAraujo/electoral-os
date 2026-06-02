import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../modules/auth/useAuthStore'
import { ROUTES } from '../constants/routes'

interface RoleRouteProps {
  allowedRoles: Array<'admin' | 'coordinator' | 'digitador'>
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ACCESS_DENIED} replace />
  }

  return <Outlet />
}
