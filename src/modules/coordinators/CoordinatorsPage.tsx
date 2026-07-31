import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Search, Filter, Eye, Pencil, Trash2,
  UserCheck, Phone, MapPin, ChevronDown,
} from 'lucide-react'
import { useCoordinatorsStore } from './useCoordinatorsStore'
import { useAuthStore } from '../auth/useAuthStore'
import { StatusBadge } from '../../components/common/StatusBadge'
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog'
import { toast } from '../../components/feedback/Toast'
import { ROUTES } from '../../constants/routes'
import { CEARA_MUNICIPALITIES, COORDINATOR_STATUS_OPTIONS } from '../../constants/options'
import type { Coordinator } from '../../types/coordinator.types'

export function CoordinatorsPage() {
  const { coordinators, remove } = useCoordinatorsStore()
  const user = useAuthStore((s) => s.user)
  const canManageCoordinators = user?.role === 'admin'

  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Coordinator | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = [...coordinators]
    .filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.neighborhood.toLowerCase().includes(search.toLowerCase())
      const matchRegion = !regionFilter || c.region === regionFilter
      const matchStatus = !statusFilter || c.status === statusFilter
      return matchSearch && matchRegion && matchStatus
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedCoordinators = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await remove(deleteTarget.id)
      toast({ type: 'success', title: 'Coordenador removido', message: deleteTarget.name })
    } catch {
      toast({ type: 'error', title: 'Erro ao excluir', message: 'Não foi possível excluir o coordenador' })
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coordenadores</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {coordinators.length} coordenadores cadastrados
          </p>
        </div>
        {canManageCoordinators && (
          <Link to={ROUTES.COORDINATORS_NEW} className="btn-primary">
            <Plus size={16} />
            Novo Coordenador
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou bairro..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="form-input pl-11 h-10 text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={regionFilter}
            onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1); }}
            className="form-input pl-8 h-10 text-sm pr-8 appearance-none min-w-32"
          >
            <option value="">Todos os municípios</option>
            {CEARA_MUNICIPALITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="form-input h-9 text-sm pr-8 appearance-none min-w-32"
          >
            <option value="">Todos os status</option>
            {COORDINATOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {(search || regionFilter || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setRegionFilter(''); setStatusFilter(''); setCurrentPage(1); }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Limpar filtros
          </button>
        )}
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} resultado(s)</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <UserCheck size={40} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Nenhum coordenador encontrado</p>
            <p className="text-slate-400 text-sm mt-1">Tente ajustar os filtros ou cadastre um novo coordenador</p>
            {canManageCoordinators && (
              <Link to={ROUTES.COORDINATORS_NEW} className="btn-primary mt-4">
                <Plus size={15} /> Cadastrar Coordenador
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Contato</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Município</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Eleitores</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedCoordinators.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 text-sm font-bold shrink-0">
                        {c.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  {/* Contact */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone size={13} className="text-slate-400" />
                      {c.phone}
                    </div>
                  </td>
                  {/* Region */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{c.region}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{c.neighborhood}</span>
                    </div>
                  </td>
                  {/* Voter count */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                      {c.voterCount}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={ROUTES.COORDINATOR_DETAIL(c.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={15} />
                      </Link>
                      {canManageCoordinators && (
                        <>
                          <Link
                            to={ROUTES.COORDINATOR_EDIT(c.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-slate-700 px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card p-4 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-500 font-semibold">Legenda de status:</span>
        <span className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Gold: &lt; 50 eleitores
        </span>
        <span className="inline-flex items-center gap-2 text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-slate-400" /> Platinum: &lt; 100 eleitores
        </span>
        <span className="inline-flex items-center gap-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Premium: &gt;= 100 eleitores
        </span>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir Coordenador"
        message={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
