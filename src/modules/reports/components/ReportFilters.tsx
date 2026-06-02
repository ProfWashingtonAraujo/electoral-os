import type { ReportFiltersState } from '../reports.types'
import { CEARA_MUNICIPALITIES, SUPPORT_STATUS_OPTIONS } from '../../../constants/options'
import { Search } from 'lucide-react'

interface ReportFiltersFormProps {
  filters: ReportFiltersState
  onChange: (filters: ReportFiltersState) => void
  coordinators: { id: string, name: string }[]
  pollingPlaces: { id: string, name: string, sections: string[] }[]
}

export function ReportFiltersForm({ filters, onChange, coordinators, pollingPlaces }: ReportFiltersFormProps) {
  const updateFilter = (key: keyof ReportFiltersState, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const selectedPlace = pollingPlaces.find(p => p.id === filters.pollingPlaceId)

  // Quando o local de votação muda, limpamos a seção selecionada
  const handlePollingPlaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlaceId = e.target.value
    onChange({ ...filters, pollingPlaceId: newPlaceId, electoralSection: '' })
  }

  return (
    <div className="card p-5 bg-white space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Busca por Nome/Título */}
        <div className="relative xl:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Busca</label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nome ou Título do Eleitor..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="form-input pl-11 h-10 w-full"
            />
          </div>
        </div>

        {/* Período */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Período de Cadastro</label>
          <select
            value={filters.period}
            onChange={(e) => updateFilter('period', e.target.value)}
            className="form-input h-10 w-full"
          >
            <option value="all">Todo o Período</option>
            <option value="today">Hoje</option>
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
          </select>
        </div>

        {/* Coordenador */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Coordenador</label>
          <select
            value={filters.coordinatorId}
            onChange={(e) => updateFilter('coordinatorId', e.target.value)}
            className="form-input h-10 w-full"
          >
            <option value="">Todos os Coordenadores</option>
            {coordinators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Status de Apoio */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Status de Apoio</label>
          <select
            value={filters.supportStatus}
            onChange={(e) => updateFilter('supportStatus', e.target.value)}
            className="form-input h-10 w-full"
          >
            <option value="">Todos os Status</option>
            {SUPPORT_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Região */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Município</label>
          <select
            value={filters.region}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="form-input h-10 w-full"
          >
            <option value="">Todos os Municípios</option>
            {CEARA_MUNICIPALITIES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>


        {/* Local de Votação */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Local de Votação</label>
          <select
            value={filters.pollingPlaceId}
            onChange={handlePollingPlaceChange}
            className="form-input h-10 w-full"
          >
            <option value="">Todos os Locais</option>
            {pollingPlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Seção */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Seção</label>
          <select
            value={filters.electoralSection}
            onChange={(e) => updateFilter('electoralSection', e.target.value)}
            className="form-input h-10 w-full"
            disabled={!filters.pollingPlaceId}
          >
            <option value="">Todas as Seções</option>
            {(selectedPlace?.sections ?? []).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            {!selectedPlace && <option disabled>Selecione um local...</option>}
          </select>
        </div>
      </div>
    </div>
  )
}
