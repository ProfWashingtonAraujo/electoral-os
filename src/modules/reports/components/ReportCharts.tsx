import { useMemo } from 'react'
import type { EnrichedVoter } from '../reports.types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { SUPPORT_STATUS_OPTIONS } from '../../../constants/options'

interface ReportChartsProps {
  voters: EnrichedVoter[]
}

export function ReportCharts({ voters }: ReportChartsProps) {
  // Dados para Gráfico de Região
  const regionData = useMemo(() => {
    const counts = voters.reduce((acc, v) => {
      acc[v.region] = (acc[v.region] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7) // Top 7
  }, [voters])

  // Dados para Status de Apoio
  const statusData = useMemo(() => {
    const counts = voters.reduce((acc, v) => {
      acc[v.supportStatus] = (acc[v.supportStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const colors: Record<string, string> = {
      gold: '#F59E0B',
      platinum: '#94A3B8',
      premium: '#3B82F6'
    }

    return SUPPORT_STATUS_OPTIONS.map(opt => ({
      name: opt.label,
      value: counts[opt.value] || 0,
      fill: colors[opt.value] || '#94a3b8'
    })).filter(d => d.value > 0)
  }, [voters])

  // Dados para Local de Votação
  const pollingPlaceData = useMemo(() => {
    const counts = voters.reduce((acc, v) => {
      const name = v.pollingPlaceName || 'Não Informado'
      acc[name] = (acc[name] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.length > 20 ? name.substring(0, 20) + '...' : name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5
  }, [voters])


  if (voters.length === 0) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Gráfico 1: Município */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Eleitores por Região (Top 7)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {regionData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#60a5fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Status de Apoio */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Status de Apoio</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {statusData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={_entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 3: Locais de Votação */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Top 5 Locais de Votação</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pollingPlaceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} interval={0} angle={-45} textAnchor="end" height={60} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
