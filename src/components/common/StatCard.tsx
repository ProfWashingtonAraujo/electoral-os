import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  change?: number
  changeLabel?: string
  suffix?: string
  children?: ReactNode
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  change,
  changeLabel = 'vs. mês anterior',
  suffix,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral = change === 0

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </p>
        {suffix && <span className="text-slate-400 text-sm mb-0.5">{suffix}</span>}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-3">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              isPositive ? 'text-green-700 bg-green-100' :
              isNegative ? 'text-red-700 bg-red-100' :
              'text-slate-500 bg-slate-100'
            }`}
          >
            {isPositive && <TrendingUp size={11} />}
            {isNegative && <TrendingDown size={11} />}
            {isNeutral && <Minus size={11} />}
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-slate-400">{changeLabel}</span>
        </div>
      )}
    </div>
  )
}
