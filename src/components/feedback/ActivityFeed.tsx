import type { Activity } from '../../types/common.types'
import { formatRelativeTime } from '../../utils/formatters'
import {
  UserPlus, UserCheck, UserMinus, PenLine,
} from 'lucide-react'

const activityConfig = {
  voter_added: {
    icon: UserPlus,
    color: 'text-green-600',
    bg: 'bg-green-100',
    label: 'Eleitor cadastrado',
  },
  voter_edited: {
    icon: PenLine,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    label: 'Eleitor atualizado',
  },
  voter_deleted: {
    icon: UserMinus,
    color: 'text-red-600',
    bg: 'bg-red-100',
    label: 'Eleitor removido',
  },
  coordinator_added: {
    icon: UserCheck,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    label: 'Coordenador cadastrado',
  },
  coordinator_edited: {
    icon: PenLine,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    label: 'Coordenador atualizado',
  },
  coordinator_deleted: {
    icon: UserMinus,
    color: 'text-red-600',
    bg: 'bg-red-100',
    label: 'Coordenador removido',
  },
  polling_place_added: {
    icon: PenLine, // using PenLine as fallback for now
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    label: 'Local de votação adicionado',
  },
  polling_place_edited: {
    icon: PenLine,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    label: 'Local de votação atualizado',
  },
  polling_place_deleted: {
    icon: UserMinus,
    color: 'text-red-600',
    bg: 'bg-red-100',
    label: 'Local de votação removido',
  },
}

interface ActivityFeedProps {
  activities: Activity[]
  maxItems?: number
}

export function ActivityFeed({ activities, maxItems = 8 }: ActivityFeedProps) {
  const items = activities.slice(0, maxItems)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-slate-400 text-sm">Nenhuma atividade registrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {items.map((act, idx) => {
        const cfg = activityConfig[act.type] ?? {
          icon: UserPlus,
          color: 'text-slate-600',
          bg: 'bg-slate-100',
          label: act.description,
        }
        const Icon = cfg.icon
        const isLast = idx === items.length - 1

        return (
          <div key={act.id} className="relative flex gap-3 py-3">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-4 top-10 bottom-0 w-px bg-slate-100" />
            )}

            {/* Icon */}
            <div className={`relative z-10 w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
              <Icon size={14} className={cfg.color} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm text-slate-800 font-medium leading-tight">
                {cfg.label}
              </p>
              <p className="text-sm text-slate-600 truncate">{act.entityName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(act.createdAt)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
