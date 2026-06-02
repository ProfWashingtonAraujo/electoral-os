import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Phone, MapPin, Users, MessageCircle } from 'lucide-react'
import { useCoordinatorsStore } from './useCoordinatorsStore'
import { useVotersStore } from '../voters/useVotersStore'
import { useAuthStore } from '../auth/useAuthStore'
import { StatusBadge } from '../../components/common/StatusBadge'
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog'
import { toast } from '../../components/feedback/Toast'
import { ROUTES } from '../../constants/routes'
import { formatDate } from '../../utils/formatters'
import { useEffect, useState } from 'react'

export function CoordinatorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const coordinator = useCoordinatorsStore((s) => s.getById(id!))
  const voters = useVotersStore((s) => s.voters)
  const votersTotal = useVotersStore((s) => s.total)
  const fetchVoters = useVotersStore((s) => s.fetch)
  const remove = useCoordinatorsStore((s) => s.remove)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const canManageCoordinators = user?.role === 'admin'

  useEffect(() => {
    if (id) {
      fetchVoters({ coordinatorId: id, page: 1, perPage: 200 })
    }
  }, [fetchVoters, id])

  if (!coordinator) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-slate-500 font-medium text-lg">Coordenador não encontrado</p>
        <Link to={ROUTES.COORDINATORS} className="btn-primary mt-4">Voltar</Link>
      </div>
    )
  }

  const handleDelete = () => {
    remove(coordinator.id)
    toast({ type: 'success', title: 'Coordenador excluído', message: coordinator.name })
    navigate(ROUTES.COORDINATORS)
  }

  const infoItems = [
    { icon: Phone, label: 'Telefone', value: coordinator.phone },
    { icon: MessageCircle, label: 'WhatsApp', value: coordinator.whatsapp },
    { icon: MapPin, label: 'Município', value: `${coordinator.region} · ${coordinator.neighborhood}` },
    { icon: MapPin, label: 'Título de Eleitor', value: coordinator.voterRegistration || '—' },
    { icon: MapPin, label: 'Local de Votação', value: coordinator.pollingPlaceName || '—' },
    { icon: MapPin, label: 'Zona/Seção', value: `${coordinator.electoralZone || '—'} / ${coordinator.electoralSection || '—'}` },
  ]

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link to={ROUTES.COORDINATORS} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{coordinator.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Cadastrado em {formatDate(coordinator.createdAt)}
            </p>
          </div>
        </div>
        {canManageCoordinators && (
          <div className="flex items-center gap-2">
            <Link to={ROUTES.COORDINATOR_EDIT(coordinator.id)} className="btn-secondary">
              <Pencil size={15} /> Editar
            </Link>
            <button onClick={() => setConfirmDelete(true)} className="btn-danger">
              <Trash2 size={15} /> Excluir
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
                {coordinator.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{coordinator.name}</p>
                <StatusBadge status={coordinator.status} size="md" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-medium text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            {coordinator.notes && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs font-semibold text-amber-700 mb-1">Observações</p>
                <p className="text-sm text-amber-800">{coordinator.notes}</p>
              </div>
            )}
          </div>

          {/* Voters list */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Eleitores Vinculados</h2>
              <span className="text-sm text-slate-400">{votersTotal} eleitores</span>
            </div>
            {voters.length === 0 ? (
              <div className="py-10 text-center">
                <Users size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Nenhum eleitor vinculado</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Bairro</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {voters.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-800">{v.name}</td>
                      <td className="px-6 py-3 text-slate-500 hidden md:table-cell">{v.neighborhood}</td>
                      <td className="px-6 py-3"><StatusBadge status={v.supportStatus} /></td>
                      <td className="px-6 py-3">
                        <Link to={ROUTES.VOTER_DETAIL(v.id)} className="text-blue-600 hover:underline text-xs font-medium">
                          Ver detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Stats */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Eleitores</p>
            <p className="text-4xl font-bold text-slate-900">{coordinator.voterCount}</p>
          </div>
          <div className="card p-5 space-y-3 text-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Timestamps</p>
            <div>
              <p className="text-slate-400 text-xs">Cadastrado em</p>
              <p className="font-medium text-slate-700">{formatDate(coordinator.createdAt)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Última atualização</p>
              <p className="font-medium text-slate-700">{formatDate(coordinator.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {canManageCoordinators && (
        <ConfirmDialog
          open={confirmDelete}
          title="Excluir Coordenador"
          message={`Tem certeza que deseja excluir "${coordinator.name}"? Todos os vínculos com eleitores serão mantidos, mas o coordenador será removido permanentemente.`}
          confirmLabel="Excluir"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}
