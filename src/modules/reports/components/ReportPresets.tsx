import { Filter, Users, UserCheck, Calendar } from 'lucide-react'
import type { ReportFiltersState } from '../reports.types'
import { initialReportFilters } from '../reports.types'

interface ReportPresetsProps {
  onApplyPreset: (preset: Partial<ReportFiltersState>) => void
}

export function ReportPresets({ onApplyPreset }: ReportPresetsProps) {
  const presets = [
    { label: 'Todos os Dados', icon: Users, filter: initialReportFilters },
    { label: 'Eleitores Gold (Fidelizados)', icon: UserCheck, filter: { ...initialReportFilters, supportStatus: 'gold' } },
    { label: 'Cadastros Recentes (30 dias)', icon: Calendar, filter: { ...initialReportFilters, period: '30days' } },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mr-2">
        <Filter size={16} />
        <span className="whitespace-nowrap">Relatórios Prontos:</span>
      </div>
      {presets.map((preset, index) => {
        const Icon = preset.icon
        return (
          <button
            key={index}
            onClick={() => onApplyPreset(preset.filter)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
          >
            <Icon size={13} />
            {preset.label}
          </button>
        )
      })
      }
    </div>
  )
}
