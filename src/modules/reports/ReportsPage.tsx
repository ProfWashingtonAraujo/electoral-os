import { useEffect, useState, useMemo } from 'react'
import { Download, SlidersHorizontal, BarChart2 } from 'lucide-react'
import { useVotersStore } from '../voters/useVotersStore'
import { useCoordinatorsStore } from '../coordinators/useCoordinatorsStore'
import { usePollingPlacesStore } from '../polling-places/usePollingPlacesStore'

import type { ReportFiltersState, EnrichedVoter } from './reports.types'
import { initialReportFilters } from './reports.types'
import { ReportPresets } from './components/ReportPresets'
import { ReportFiltersForm } from './components/ReportFilters'
import { ReportSummaryCards } from './components/ReportSummaryCards'
import { ReportCharts } from './components/ReportCharts'
import { ReportTable } from './components/ReportTable'
import { exportReportPDF } from './services/exportReportPDF'
import { useAuthStore } from '../auth/useAuthStore'
import { auditApi } from '../../api/audit.api'

export function ReportsPage() {
  const voters = useVotersStore((s) => s.voters)
  const user = useAuthStore((s) => s.user)
  const fetchAllVoters = useVotersStore((s) => s.fetchAll)
  const coordinators = useCoordinatorsStore((s) => s.coordinators)
  const pollingPlaces = usePollingPlacesStore((s) => s.pollingPlaces)

  useEffect(() => {
    if (voters.length === 0) {
      fetchAllVoters()
    }
  }, [fetchAllVoters, voters.length])

  const [filters, setFilters] = useState<ReportFiltersState>(initialReportFilters)
  const [showFilters, setShowFilters] = useState(false)

  // Enriquecer eleitores com nomes (para não precisarmos buscar no render de cada filho)
  const enrichedVoters = useMemo<EnrichedVoter[]>(() => {
    return voters.map(v => ({
      ...v,
      coordinatorName: coordinators.find(c => c.id === v.coordinatorId)?.name || 'Sem Coordenador',
      pollingPlaceName: pollingPlaces.find(p => p.id === v.pollingPlaceId)?.name || 'Não Informado'
    }))
  }, [voters, coordinators, pollingPlaces])

  // Aplicar filtros avançados
  const filteredVoters = useMemo(() => {
    return enrichedVoters.filter(v => {
      // Busca Textual
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        if (!v.name.toLowerCase().includes(term) && !v.voterRegistration.includes(term)) {
          return false
        }
      }
      
      // Igualdades Exatas
      if (filters.coordinatorId && v.coordinatorId !== filters.coordinatorId) return false
      if (filters.region && v.region !== filters.region) return false
      if (filters.pollingPlaceId && v.pollingPlaceId !== filters.pollingPlaceId) return false
      if (filters.electoralZone && v.electoralZone !== filters.electoralZone) return false
      if (filters.supportStatus && v.supportStatus !== filters.supportStatus) return false
      
      // Filtro de Seção
      if (filters.electoralSection && v.electoralSection !== filters.electoralSection) return false

      // Período
      if (filters.period !== 'all') {
        const created = new Date(v.createdAt)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - created.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (filters.period === 'today' && diffDays > 1) return false
        if (filters.period === '7days' && diffDays > 7) return false
        if (filters.period === '30days' && diffDays > 30) return false
      }

      return true
    })
  }, [enrichedVoters, filters])

  const activeCoordinatorsCount = useMemo(() => {
    return new Set(filteredVoters.map(v => v.coordinatorId).filter(Boolean)).size
  }, [filteredVoters])

  const handleExportPDF = async () => {
    exportReportPDF(filteredVoters, filters, {
      name: user?.name,
      email: user?.email,
      role: user?.role,
    })

    try {
      await auditApi.create({
        type: 'report_export',
        message: 'Exportação de relatório PDF realizada',
        userName: user?.name,
        userEmail: user?.email,
        metadata: {
          totalRecords: filteredVoters.length,
          filters,
          format: 'pdf',
        },
      })
    } catch {
      // Non-blocking: export should not fail because audit log failed.
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <BarChart2 size={16} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Painel de Relatórios</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1 ml-10">Análise estratégica avançada e cruzamento de dados</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary ${showFilters ? 'bg-slate-100 border-slate-300' : ''}`}
          >
            <SlidersHorizontal size={15} /> Filtros Avançados
          </button>
          <button 
            onClick={handleExportPDF}
            className="btn-primary shadow-blue-500/20"
            disabled={filteredVoters.length === 0}
          >
            <Download size={15} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Relatórios Prontos (Presets) */}
      <ReportPresets onApplyPreset={(preset) => setFilters({ ...initialReportFilters, ...preset })} />

      {/* Filtros Avançados Expansíveis */}
      {showFilters && (
        <div className="animate-fade-in">
          <ReportFiltersForm 
            filters={filters} 
            onChange={setFilters}
            coordinators={coordinators}
            pollingPlaces={pollingPlaces}
          />
        </div>
      )}

      {/* Cards de Resumo */}
      <ReportSummaryCards 
        voters={filteredVoters} 
        activeCoordinatorsCount={activeCoordinatorsCount}
      />

      {/* Gráficos */}
      <ReportCharts voters={filteredVoters} />

      {/* Tabela Detalhada */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-lg font-bold text-slate-900">Listagem Detalhada ({filteredVoters.length} registros)</h2>
      </div>
      <ReportTable voters={filteredVoters} />
    </div>
  )
}
