import { Bookmark } from 'lucide-react'
import type { ReportFiltersState } from '../reports.types'

interface Preset {
  label: string
  description: string
  filters: Partial<ReportFiltersState>
}

const PRESETS: Preset[] = [
  {
    label: 'Últimos 7 dias',
    description: 'Eleitores cadastrados na última semana',
    filters: { period: '7days' },
  },
  {
    label: 'Última semana – Ouro',
    description: 'Apoiadores Gold nos últimos 7 dias',
    filters: { period: '7days', supportStatus: 'gold' },
  },
  {
    label: 'Último mês',
    description: 'Eleitores cadastrados nos últimos 30 dias',
    filters: { period: '30days' },
  },
  {
    label: 'Apoio Platinum',
    description: 'Todos os eleitores com status Platinum',
    filters: { supportStatus: 'platinum' },
  },
  {
    label: 'Apoio Premium',
    description: 'Todos os eleitores com status Premium',
    filters: { supportStatus: 'premium' },
  },
  {
    label: 'Cadastro Manual',
    description: 'Eleitores cadastrados manualmente',
    filters: {},
  },
]

interface Props {
  onApplyPreset: (preset: Partial<ReportFiltersState>) => void
}

export function ReportPresets({ onApplyPreset }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark size={16} className="text-blue-600" />
        <h2 className="text-sm font-semibold text-slate-700">Relatórios Prontos</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onApplyPreset(preset.filters)}
            className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 leading-tight">
              {preset.label}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-tight">{preset.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
