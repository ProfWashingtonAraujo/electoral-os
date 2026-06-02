import { Users, UserCheck, TrendingUp, Map, MapPin, Hash } from 'lucide-react'
import type { EnrichedVoter } from '../reports.types'

interface ReportSummaryCardsProps {
  voters: EnrichedVoter[]
  activeCoordinatorsCount: number
}

export function ReportSummaryCards({ voters, activeCoordinatorsCount }: ReportSummaryCardsProps) {
  // Calculando métricas baseadas apenas nos eleitores filtrados
  const goldCount = voters.filter(v => v.supportStatus === 'gold').length
  const goldRate = voters.length > 0 ? Math.round((goldCount / voters.length) * 100) : 0

  const uniqueRegions = new Set(voters.map(v => v.region)).size
  const uniquePollingPlaces = new Set(voters.map(v => v.pollingPlaceId).filter(Boolean)).size
  const uniqueSections = new Set(voters.map(v => v.electoralSection).filter(Boolean)).size

  const cards = [
    { label: 'Eleitores Listados', value: voters.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Coordenadores Relacionados', value: activeCoordinatorsCount, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Taxa Gold (Fidelizados)', value: `${goldRate}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Municípios Impactados', value: uniqueRegions, icon: Map, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Locais de Votação', value: uniquePollingPlaces, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Seções Atendidas', value: uniqueSections, icon: Hash, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }, idx) => (
        <div key={idx} className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={14} className={color} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  )
}
