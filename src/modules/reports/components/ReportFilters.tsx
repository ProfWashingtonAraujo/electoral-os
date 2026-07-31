import { Search } from 'lucide-react'
import type { ReportFiltersState } from '../reports.types'
import type { Coordinator } from '../../../types/coordinator.types'
import type { PollingPlace } from '../../../types/polling-place.types'

interface Props {
  filters: ReportFiltersState
  onChange: (filters: ReportFiltersState) => void
  coordinators: Coordinator[]
  pollingPlaces: PollingPlace[]
}

export function ReportFiltersForm({ filters, onChange, coordinators, pollingPlaces }: Props) {
  const set = (key: keyof ReportFiltersState, value: string) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-x-5 gap-y-6">
        {/* Row 1 */}
        {/* Busca textual */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Busca</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nome ou Título do Eleitor..."
              value={filters.searchTerm}
              onChange={(e) => set('searchTerm', e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
            />
          </div>
        </div>

        {/* Período */}
        <div className="md:col-span-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Período de Cadastro</label>
          <select
            value={filters.period}
            onChange={(e) => set('period', e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow appearance-none bg-white"
          >
            <option value="all">Todo o Período</option>
            <option value="today">Hoje</option>
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
          </select>
        </div>

        {/* Coordenador */}
        <div className="md:col-span-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Coordenador</label>
          <select
            value={filters.coordinatorId}
            onChange={(e) => set('coordinatorId', e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow appearance-none bg-white"
          >
            <option value="">Todos os Coordenadores</option>
            {coordinators.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status de Apoio */}
        <div className="md:col-span-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status de Apoio</label>
          <select
            value={filters.supportStatus}
            onChange={(e) => set('supportStatus', e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow appearance-none bg-white"
          >
            <option value="">Todos os Status</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        {/* Row 2 */}
        {/* Município (Region) */}
        <div className="md:col-span-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Município</label>
          <select
            value={filters.region}
            onChange={(e) => set('region', e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow appearance-none bg-white"
          >
            <option value="">Todos os Municípios</option>
            {/* Adicione a lista de municípios se desejar */}
          </select>
        </div>

        {/* Local de Votação */}
        <div className="md:col-span-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Local de Votação</label>
          <select
            value={filters.pollingPlaceId}
            onChange={(e) => set('pollingPlaceId', e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow appearance-none bg-white"
          >
            <option value="">Todos os Locais</option>
            {pollingPlaces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Seção Eleitoral */}
        <div className="md:col-span-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Seção</label>
          <select
            value={filters.electoralSection}
            onChange={(e) => set('electoralSection', e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow appearance-none bg-white"
          >
            <option value="">Todas as Seções</option>
            {/* Se houver opções específicas de seção, adicione aqui */}
          </select>
        </div>
      </div>
    </div>
  )
}
