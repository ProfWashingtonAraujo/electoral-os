import type { SupportStatus, Status } from '../../types/common.types'

type BadgeVariant = SupportStatus | Status | string

const config: Record<string, { label: string; className: string }> = {
  // Support status
  gold: { label: 'Gold', className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  platinum: { label: 'Platinum', className: 'bg-slate-100 text-slate-700 border border-slate-200' },
  premium: { label: 'Premium', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  // Coordinator status
  active: { label: 'Ativo', className: 'bg-green-100 text-green-700 border border-green-200' },
  inactive: { label: 'Inativo', className: 'bg-slate-100 text-slate-600 border border-slate-200' },
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
}

interface StatusBadgeProps {
  status: BadgeVariant
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { label, className } = config[status] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${className} ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'gold' || status === 'active' ? 'bg-amber-500' :
        status === 'premium' ? 'bg-blue-500' :
        status === 'inactive' ? 'bg-slate-400' :
        status === 'platinum' ? 'bg-slate-400' :
        'bg-yellow-500'
      }`} />
      {label}
    </span>
  )
}
