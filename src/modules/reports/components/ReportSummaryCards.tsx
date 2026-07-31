import { Users, Star, MapPin, UserCheck } from 'lucide-react'
import type { EnrichedVoter } from '../reports.types'

interface Props {
  voters: EnrichedVoter[]
  activeCoordinatorsCount: number
}

interface CardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, icon, color }: CardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{title}</p>
      </div>
    </div>
  )
}

export function ReportSummaryCards({ voters, activeCoordinatorsCount }: Props) {
  const goldCount = voters.filter((v) => v.supportStatus === 'gold').length
  const platinumCount = voters.filter((v) => v.supportStatus === 'platinum').length
  const premiumCount = voters.filter((v) => v.supportStatus === 'premium').length

  const uniqueRegions = new Set(voters.map((v) => v.region).filter(Boolean)).size

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total de Eleitores"
        value={voters.length}
        icon={<Users size={20} />}
        color="bg-blue-600"
      />
      <StatCard
        title="Coordenadores Ativos"
        value={activeCoordinatorsCount}
        icon={<UserCheck size={20} />}
        color="bg-indigo-600"
      />
      <StatCard
        title="Regiões Cobertas"
        value={uniqueRegions}
        icon={<MapPin size={20} />}
        color="bg-emerald-600"
      />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <p className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-1">
          <Star size={14} className="text-amber-500" /> Status de Apoio
        </p>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-xl font-black text-amber-500">{goldCount}</p>
            <p className="text-xs text-slate-400">Gold</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-500">{platinumCount}</p>
            <p className="text-xs text-slate-400">Platinum</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-purple-600">{premiumCount}</p>
            <p className="text-xs text-slate-400">Premium</p>
          </div>
        </div>
      </div>
    </div>
  )
}
