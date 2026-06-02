import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { useAuthStore } from '../../modules/auth/useAuthStore'
import { useCoordinatorsStore } from '../../modules/coordinators/useCoordinatorsStore'
import { useVotersStore } from '../../modules/voters/useVotersStore'
import { ROUTES } from '../../constants/routes'

const navItems = [
  { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Painel' },
  { to: ROUTES.COORDINATORS, icon: UserCheck, label: 'Coordenadores', badge: 'coordinators' },
  { to: ROUTES.VOTERS, icon: Users, label: 'Eleitores', badge: 'voters' },
  { to: ROUTES.POLLING_PLACES, icon: MapPin, label: 'Locais de Votação' },
  { to: ROUTES.REPORTS, icon: BarChart3, label: 'Relatórios' },
  { to: ROUTES.SETTINGS, icon: Settings, label: 'Configurações' },
]

export function AppSidebar() {
  const { user, logout } = useAuthStore()
  const coordinators = useCoordinatorsStore((s) => s.coordinators)
  const totalVoters = useVotersStore((s) => s.stats?.total ?? s.total)
  const navigate = useNavigate()

  const badges: Record<string, number> = {
    coordinators: coordinators.length,
    voters: totalVoters,
  }
  const digitadorAllowedRoutes: string[] = [ROUTES.DASHBOARD, ROUTES.VOTERS]

  const filteredNavItems = navItems.filter((item) => {
    if (user?.role === 'digitador') {
      return digitadorAllowedRoutes.includes(item.to)
    }

    if (user?.role === 'coordinator') {
      return item.to !== ROUTES.REPORTS && item.to !== ROUTES.SETTINGS
    }

    return true
  })

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 flex flex-col z-50"
      style={{ background: 'linear-gradient(180deg, #0F1C3F 0%, #0d1a38 60%, #0a1530 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight">ElectoraOS</p>
          <p className="text-slate-400 text-xs">Gestão Eleitoral</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Módulos
        </p>
        {filteredNavItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item group relative ${isActive ? 'active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
                <span className="flex-1">{label}</span>
                {badge && badges[badge] !== undefined && (
                  <span
                    className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: isActive ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.08)',
                      color: isActive ? '#93C5FD' : '#94A3B8',
                    }}
                  >
                    {badges[badge]}
                  </span>
                )}
                {isActive && (
                  <ChevronRight size={14} className="text-blue-400 ml-1" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="border-t border-white/10 px-3 py-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() ?? 'AS'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-slate-400 text-xs truncate">{user?.email ?? ''}</p>
            {user?.role === 'digitador' && (
              <p className="text-amber-300 text-[11px] mt-1">Perfil: cadastro, consulta e edição de eleitores</p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-item w-full mt-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
