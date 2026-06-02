import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { ROUTES } from '../../constants/routes'

export function AccessDeniedPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card p-8 max-w-md w-full text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <ShieldX size={26} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Acesso restrito</h1>
          <p className="text-slate-500 text-sm mt-1">
            Seu perfil não possui permissão para visualizar esta página.
          </p>
        </div>
        <Link to={ROUTES.DASHBOARD} className="btn-primary inline-flex">
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  )
}
