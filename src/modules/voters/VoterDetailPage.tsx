import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, MapPin, Phone, User } from 'lucide-react'
import { useVotersStore } from './useVotersStore'
import { useAuthStore } from '../auth/useAuthStore'
import { voterApi } from '../../api/voter.api'
import { useCoordinatorsStore } from '../coordinators/useCoordinatorsStore'
import { usePollingPlacesStore } from '../polling-places/usePollingPlacesStore'
import { StatusBadge } from '../../components/common/StatusBadge'
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog'
import { toast } from '../../components/feedback/Toast'
import { ROUTES } from '../../constants/routes'
import { formatDate } from '../../utils/formatters'
import { REGISTRATION_SOURCE_OPTIONS } from '../../constants/options'

export function VoterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const voterFromStore = useVotersStore((s) => s.getById(id!))
  const [fetchedVoter, setFetchedVoter] = useState<typeof voterFromStore>(undefined)
  const remove = useVotersStore((s) => s.remove)
  const voter = voterFromStore ?? fetchedVoter
  const coordinator = useCoordinatorsStore((s) => s.getById(voter?.coordinatorId ?? ''))
  const getPollingPlaceById = usePollingPlacesStore((s) => s.getById)
  const pollingPlace = getPollingPlaceById(voter?.pollingPlaceId ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const canEditVoters = !!user
  const canDeleteVoters = user?.role !== 'digitador'

  useEffect(() => {
    let cancelled = false
    if (!voter && id) {
      voterApi.getById(id).then((data) => {
        if (!cancelled) setFetchedVoter(data)
      }).catch(() => {
        // not found
      })
    }
    return () => { cancelled = true }
  }, [id, voter])

  if (!voter) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-slate-500 font-medium text-lg">Eleitor não encontrado</p>
        <Link to={ROUTES.VOTERS} className="btn-primary mt-4">Voltar</Link>
      </div>
    )
  }

  const handleDelete = () => {
    remove(voter.id)
    toast({ type: 'success', title: 'Eleitor removido', message: voter.name })
    navigate(ROUTES.VOTERS)
  }

  const sourceLabel = REGISTRATION_SOURCE_OPTIONS.find((o) => o.value === voter.registrationSource)?.label ?? voter.registrationSource

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link to={ROUTES.VOTERS} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{voter.name}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Cadastrado em {formatDate(voter.createdAt)}</p>
          </div>
        </div>
        {canEditVoters && (
          <div className="flex items-center gap-2">
            <Link to={ROUTES.VOTER_EDIT(voter.id)} className="btn-secondary">
              <Pencil size={15} /> Editar
            </Link>
            {canDeleteVoters && (
              <button onClick={() => setConfirmDelete(true)} className="btn-danger">
                <Trash2 size={15} /> Excluir
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Info */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 text-xl font-bold">
                {voter.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{voter.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={voter.supportStatus} size="md" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Phone, label: 'WhatsApp', value: voter.whatsapp },
                { icon: User, label: 'Coordenador', value: coordinator?.name ?? '—' },
                { icon: MapPin, label: 'Endereço', value: voter.address },
                { icon: MapPin, label: 'Bairro / Região', value: `${voter.neighborhood} · ${voter.region}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
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
          </div>

          {/* Electoral data */}
          <div className="card p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-3 mb-5">Dados Eleitorais</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Título de Eleitor', value: voter.voterRegistration },
                { label: 'Zona Eleitoral', value: voter.electoralZone },
                { label: 'Seção', value: voter.electoralSection },
                { label: 'Local de Votação', value: pollingPlace?.name ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {voter.notes && (
            <div className="card p-5 bg-amber-50 border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Observações</p>
              <p className="text-sm text-amber-800">{voter.notes}</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4 text-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Informações</p>
            <div>
              <p className="text-slate-400 text-xs">Origem do Cadastro</p>
              <p className="font-medium text-slate-700 mt-0.5">{sourceLabel}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Cadastrado em</p>
              <p className="font-medium text-slate-700 mt-0.5">{formatDate(voter.createdAt)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Última atualização</p>
              <p className="font-medium text-slate-700 mt-0.5">{formatDate(voter.updatedAt)}</p>
            </div>
          </div>

          {pollingPlace && (
            <div className="card p-5 space-y-2 text-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Local de Votação</p>
              <p className="font-semibold text-slate-800">{pollingPlace.name}</p>
              <p className="text-slate-500 text-xs">{pollingPlace.address}</p>
              <p className="text-slate-400 text-xs">Zona {pollingPlace.electoralZone}</p>
              <Link
                to={ROUTES.POLLING_PLACE_DETAIL(pollingPlace.id)}
                className="text-blue-600 text-xs font-medium hover:underline block mt-2"
              >
                Ver detalhes do local →
              </Link>
            </div>
          )}
        </div>
      </div>

      {canDeleteVoters && (
        <ConfirmDialog
          open={confirmDelete}
          title="Excluir Eleitor"
          message={`Tem certeza que deseja excluir "${voter.name}"?`}
          confirmLabel="Excluir"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}
