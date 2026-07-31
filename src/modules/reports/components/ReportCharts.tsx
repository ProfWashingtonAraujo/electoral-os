import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { EnrichedVoter } from '../reports.types'

interface Props {
  voters: EnrichedVoter[]
}

const STATUS_COLORS: Record<string, string> = {
  gold: '#f59e0b',
  platinum: '#64748b',
  premium: '#7c3aed',
}

export function ReportCharts({ voters }: Props) {
  // Distribuição por status
  const statusData = ['gold', 'platinum', 'premium'].map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: voters.filter((v) => v.supportStatus === s).length,
  }))

  // Top 8 coordenadores por número de eleitores
  const coordMap: Record<string, number> = {}
  voters.forEach((v) => {
    const name = v.coordinatorName || 'Sem Coordenador'
    coordMap[name] = (coordMap[name] || 0) + 1
  })
  const coordData = Object.entries(coordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, total]) => ({ name: name.split(' ')[0], total }))

  // Distribuição por região
  const regionMap: Record<string, number> = {}
  voters.forEach((v) => {
    const r = v.region || 'Não informado'
    regionMap[r] = (regionMap[r] || 0) + 1
  })
  const regionData = Object.entries(regionMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, total]) => ({ name, total }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Pie – Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Status de Apoio</h3>
        {voters.length === 0 ? (
          <p className="text-slate-400 text-sm text-center mt-10">Sem dados</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toLowerCase()] ?? '#94a3b8'} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar – Coordenadores */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Top Coordenadores</h3>
        {coordData.length === 0 ? (
          <p className="text-slate-400 text-sm text-center mt-10">Sem dados</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={coordData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar – Regiões */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Distribuição por Região</h3>
        {regionData.length === 0 ? (
          <p className="text-slate-400 text-sm text-center mt-10">Sem dados</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
