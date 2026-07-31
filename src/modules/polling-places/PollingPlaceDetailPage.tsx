import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, FileText, Edit, Trash2 } from 'lucide-react'
import { usePollingPlacesStore } from './usePollingPlacesStore'
import { useVotersStore } from '../voters/useVotersStore'
import { StatusBadge } from '../../components/common/StatusBadge'
import { toast } from '../../components/feedback/Toast'
import { ROUTES } from '../../constants/routes'
import { useEffect } from 'react'

export function PollingPlaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const place = usePollingPlacesStore((s) => s.getById(id!))
  const remove = usePollingPlacesStore((s) => s.remove)
  const voters = useVotersStore((s) => s.voters)
  const votersTotal = useVotersStore((s) => s.total)
  const fetchVoters = useVotersStore((s) => s.fetch)

  useEffect(() => {
    if (id) {
      fetchVoters({ pollingPlaceId: id, page: 1, perPage: 200 })
    }
  }, [fetchVoters, id])

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-slate-500 font-medium">Local de votação não encontrado</p>
        <Link to={ROUTES.POLLING_PLACES} className="btn-primary mt-4">Voltar</Link>
      </div>
    )
  }

  const goldCount = voters.filter((v) => v.supportStatus === 'gold').length
  const platinumCount = voters.filter((v) => v.supportStatus === 'platinum').length
  const premiumCount = voters.filter((v) => v.supportStatus === 'premium').length

  const handleDelete = async () => {
    if (voters.length > 0) {
      toast({ type: 'error', title: 'Não é possível excluir', message: 'Existem eleitores vinculados a este local.' })
      return
    }
    if (confirm('Tem certeza que deseja excluir este local de votação?')) {
      try {
        await remove(id!)
        toast({ type: 'success', title: 'Local excluído' })
        navigate(ROUTES.POLLING_PLACES)
      } catch {
        toast({ type: 'error', title: 'Erro ao excluir', message: 'Não foi possível excluir o local' })
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={ROUTES.POLLING_PLACES} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{place.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1">
              <MapPin size={13} /> {place.address} · {place.neighborhood} · {place.region}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={ROUTES.POLLING_PLACE_EDIT(id!)} className="btn-secondary">
            <Edit size={16} /> Editar
          </Link>
          <button onClick={handleDelete} className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            <Trash2 size={16} /> Excluir
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total de Eleitores', value: votersTotal, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Gold', value: goldCount, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Platinum', value: platinumCount, color: 'text-slate-700', bg: 'bg-slate-50' },
          { label: 'Premium', value: premiumCount, color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`card p-4 ${bg}`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Voter list */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Eleitores neste Local</h2>
            <span className="text-sm text-slate-400">{votersTotal}</span>
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
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Seção</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {voters.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link to={ROUTES.VOTER_DETAIL(v.id)} className="font-medium text-slate-800 hover:text-blue-600 transition-colors">
                        {v.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-500 hidden md:table-cell">
                      Seção {v.electoralSection}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={v.supportStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Sections */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={15} className="text-slate-400" />
            <h2 className="font-semibold text-slate-900">Seções Disponíveis</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {place.sections.map((s) => {
              const hasVoters = voters.some((v) => v.electoralSection === s)
              return (
                <span
                  key={s}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    hasVoters
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  {s}
                </span>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4">
            {place.sections.filter((s) => voters.some((v) => v.electoralSection === s)).length} de {place.sections.length} seções com eleitores
          </p>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Zona Eleitoral</span>
              <span className="font-semibold text-slate-800">{place.electoralZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Município</span>
              <span className="font-semibold text-slate-800">{place.region}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
