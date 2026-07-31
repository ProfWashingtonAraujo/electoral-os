import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ChevronDown, Eye, Pencil, Trash2, Users } from 'lucide-react'
import { useVotersStore } from './useVotersStore'
import { useCoordinatorsStore } from '../coordinators/useCoordinatorsStore'
import { useAuthStore } from '../auth/useAuthStore'
import { StatusBadge } from '../../components/common/StatusBadge'
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog'
import { toast } from '../../components/feedback/Toast'
import { ROUTES } from '../../constants/routes'
import { CEARA_MUNICIPALITIES, SUPPORT_STATUS_OPTIONS } from '../../constants/options'
import type { Voter } from '../../types/voter.types'

export function VotersPage() {
  const { voters, total, fetch, remove } = useVotersStore()
  const coordinators = useCoordinatorsStore((s) => s.coordinators)
  const user = useAuthStore((s) => s.user)
  const canEditVoters = !!user
  const canDeleteVoters = user?.role !== 'digitador'

  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [coordinatorFilter, setCoordinatorFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Voter | null>(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 15

  useEffect(() => {
    fetch({
      page,
      perPage: PER_PAGE,
      search,
      region: regionFilter || undefined,
      supportStatus: statusFilter || undefined,
      coordinatorId: coordinatorFilter || undefined,
    })
  }, [fetch, page, regionFilter, statusFilter, coordinatorFilter, search])

  const totalPages = Math.ceil((total || 0) / PER_PAGE)

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    return [1, '...', current - 1, current, current + 1, '...', total]
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await remove(deleteTarget.id)
      toast({ type: 'success', title: 'Eleitor removido', message: deleteTarget.name })
    } catch {
      toast({ type: 'error', title: 'Erro ao excluir', message: 'Não foi possível excluir o eleitor' })
    }
    setDeleteTarget(null)
  }

  const getCoordinatorName = (id: string) =>
    coordinators.find((c) => c.id === id)?.name ?? '—'

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Eleitores</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} eleitores cadastrados</p>
        </div>
        <Link to={ROUTES.VOTERS_NEW} className="btn-primary">
          <Plus size={16} /> Novo Eleitor
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Nome, bairro ou título de eleitor..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="form-input pl-11 h-9 text-sm"
          />
        </div>
        {[
          {
            value: regionFilter, onChange: (v: string) => { setRegionFilter(v); setPage(1) },
            placeholder: 'Todos os municípios',
            options: CEARA_MUNICIPALITIES.map((r) => ({ value: r, label: r })),
          },
          {
            value: statusFilter, onChange: (v: string) => { setStatusFilter(v); setPage(1) },
            placeholder: 'Todos os status',
            options: SUPPORT_STATUS_OPTIONS,
          },
          {
            value: coordinatorFilter, onChange: (v: string) => { setCoordinatorFilter(v); setPage(1) },
            placeholder: 'Todos os coordenadores',
            options: coordinators.map((c) => ({ value: c.id, label: c.name })),
          },
        ].map(({ value, onChange, placeholder, options }, i) => (
          <div key={i} className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="form-input h-10 text-sm pr-8 appearance-none min-w-36"
            >
              <option value="">{placeholder}</option>
              {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        ))}
        {(search || regionFilter || statusFilter || coordinatorFilter) && (
          <button
            onClick={() => { setSearch(''); setRegionFilter(''); setStatusFilter(''); setCoordinatorFilter(''); setPage(1) }}
            className="text-xs text-blue-600 font-medium"
          >
            Limpar filtros
          </button>
        )}
        <span className="text-xs text-slate-400 ml-auto">{total} resultado(s)</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {voters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users size={40} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhum eleitor encontrado</p>
            <Link to={ROUTES.VOTERS_NEW} className="btn-primary mt-4">
              <Plus size={15} /> Cadastrar Eleitor
            </Link>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Eleitor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Coordenador</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Bairro / Município</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Zona / Seção</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {voters.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-semibold text-slate-900">{v.name}</p>
                        <p className="text-slate-400 text-xs">{v.whatsapp}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-slate-600 text-sm">
                      {getCoordinatorName(v.coordinatorId)}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-slate-700">{v.neighborhood}</p>
                      <p className="text-slate-400 text-xs">{v.region}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden xl:table-cell">
                      <p className="text-slate-600">Zona {v.electoralZone}</p>
                      <p className="text-slate-400 text-xs">Seção {v.electoralSection}</p>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={v.supportStatus} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={ROUTES.VOTER_DETAIL(v.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={15} />
                        </Link>
                        {canEditVoters && (
                          <Link
                            to={ROUTES.VOTER_EDIT(v.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </Link>
                        )}
                        {canDeleteVoters && (
                          <button
                            onClick={() => setDeleteTarget(v)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500">
                  Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} de {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    className="px-3 py-1.5 text-xs rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed hidden sm:block"
                  >
                    Primeiro
                  </button>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 text-xs rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>

                  {getPageNumbers(page, totalPages).map((p, idx) => (
                    p === '...' ? (
                      <span key={`dots-${idx}`} className="px-2 text-slate-400">...</span>
                    ) : (
                      <button
                        key={`page-${p}`}
                        onClick={() => setPage(p as number)}
                        className={`w-8 h-8 text-xs rounded border transition-colors ${
                          p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:bg-white text-slate-600'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  ))}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 text-xs rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    className="px-3 py-1.5 text-xs rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed hidden sm:block"
                  >
                    Último
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir Eleitor"
        message={`Tem certeza que deseja excluir "${deleteTarget?.name}"?`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
