import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  Users, UserCheck, ThumbsUp, MapPin,
  Calendar,
} from 'lucide-react'
import { useVotersStore } from '../voters/useVotersStore'
import { useCoordinatorsStore } from '../coordinators/useCoordinatorsStore'
import { useAuthStore } from '../auth/useAuthStore'
import { StatCard } from '../../components/common/StatCard'
import { ActivityFeed } from '../../components/feedback/ActivityFeed'

function monthLabel(ym: string) {
  const [yStr, mStr] = ym.split('-')
  const y = Number(yStr)
  const m = Number(mStr)
  if (!y || !m) return ym
  const d = new Date(y, m - 1, 1)
  return d.toLocaleDateString('pt-BR', { month: 'short' })
}

const STATUS_COLORS = {
  gold: '#F59E0B',
  platinum: '#94A3B8',
  premium: '#3B82F6',
}

const STATUS_LABELS = {
  gold: 'Gold',
  platinum: 'Platinum',
  premium: 'Premium',
}

type Period = '30d' | '90d' | 'all'

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: 'all', label: 'Tudo' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-sm shadow-lg">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-blue-600 font-bold">{payload[0].value} eleitores</p>
      </div>
    )
  }
  return null
}

export function DashboardPage() {
  const votersStats = useVotersStore((s) => s.stats)
  const fetchVotersStats = useVotersStore((s) => s.fetchStats)
  const activities = useVotersStore((s) => s.activities)
  const coordinators = useCoordinatorsStore((s) => s.coordinators)
  const user = useAuthStore((s) => s.user)
  const [period, setPeriod] = useState<Period>('all')

  useEffect(() => {
    fetchVotersStats(period)
  }, [fetchVotersStats, period])

  // ─── Computed metrics ───
  const totalVoters = votersStats?.total ?? 0
  const totalCoordinators = coordinators.length
  const supportCount = votersStats?.statusCounts?.gold ?? 0
  const supportPct = totalVoters > 0 ? Math.round((supportCount / totalVoters) * 100) : 0

  // Donut data
  const statusCounts = {
    gold: votersStats?.statusCounts?.gold ?? 0,
    platinum: votersStats?.statusCounts?.platinum ?? 0,
    premium: votersStats?.statusCounts?.premium ?? 0,
  }
  const donutData = Object.entries(statusCounts).map(([key, value]) => ({
    name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
    value,
    color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
  }))

  // Region ranking
  const regions = (votersStats?.topRegions ?? []).map((r) => ({
    region: r.region,
    count: r.count,
    pct: totalVoters > 0 ? Math.round((r.count / totalVoters) * 100) : 0,
  }))

  const growthData = (votersStats?.growthByMonth ?? []).map((g) => ({
    month: monthLabel(g.month),
    eleitores: g.count,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Olá, {user?.name?.split(' ')[0] || 'Usuário'} 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Visão estratégica geral da campanha</p>
        </div>
        {/* Period filter */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          <Calendar size={14} className="text-slate-400 ml-2" />
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                period === opt.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total de Eleitores"
          value={totalVoters}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          change={12}
        />
        <StatCard
          title="Coordenadores Ativos"
          value={totalCoordinators}
          icon={UserCheck}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          change={5}
        />
        <StatCard
          title="Taxa de Apoio"
          value={supportPct}
          suffix="%"
          icon={ThumbsUp}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          change={3}
        />
        <StatCard
          title="Regiões Atendidas"
          value={votersStats?.regionsCount ?? 0}
          icon={MapPin}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-slate-900">Crescimento da Base</h2>
              <p className="text-xs text-slate-400 mt-0.5">Evolução de cadastros por mês</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={growthData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={CustomTooltip} />
              <Line
                type="monotone"
                dataKey="eleitores"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#2563EB' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="card p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Status dos Eleitores</h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribuição por posicionamento</p>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart margin={{ top: 12, right: 8, left: 8, bottom: 0 }}>
              <Pie
                data={donutData}
                cx="50%"
                cy="45%"
                innerRadius={48}
                outerRadius={64}
                paddingAngle={3}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: '#475569' }}>{value}</span>
                )}
              />
              <Tooltip
                formatter={(value, name) => [`${value} eleitores`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Status summary */}
          <div className="mt-2 space-y-2">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Region ranking */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">Ranking das Regiões</h2>
            <p className="text-xs text-slate-400 mt-0.5">Eleitores por macro-região</p>
          </div>
          {regions.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Sem dados disponíveis</p>
          ) : (
            <div className="space-y-4">
              {regions.map(({ region, count, pct }, idx) => (
                <div key={region}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}</span>
                      <span className="text-sm font-medium text-slate-700">{region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{count}</span>
                      <span className="text-xs font-semibold text-blue-600">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, #2563EB, #60A5FA)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="xl:col-span-2 card p-6">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Atividades Recentes</h2>
            <p className="text-xs text-slate-400 mt-0.5">Últimas ações realizadas na plataforma</p>
          </div>
          <ActivityFeed activities={activities} maxItems={6} />
        </div>
      </div>
    </div>
  )
}
