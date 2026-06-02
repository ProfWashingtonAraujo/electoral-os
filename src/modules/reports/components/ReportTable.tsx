import type { EnrichedVoter } from '../reports.types'
import { StatusBadge } from '../../../components/common/StatusBadge'
import { formatDate } from '../../../utils/formatters'

interface ReportTableProps {
  voters: EnrichedVoter[]
}

export function ReportTable({ voters }: ReportTableProps) {
  if (voters.length === 0) return null

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Eleitor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Contato</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Localidade</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Votação</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Coordenador</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Cadastro</th>
              <th className="hidden print:table-cell text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Status 2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {voters.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 whitespace-nowrap">{v.name}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-600 whitespace-nowrap">{v.whatsapp}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-800 whitespace-nowrap">{v.neighborhood}</p>
                  <p className="text-xs text-slate-500 whitespace-nowrap">{v.region}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-800 max-w-[200px] truncate" title={v.pollingPlaceName}>
                    {v.pollingPlaceName}
                  </p>
                  <p className="text-xs text-slate-500 whitespace-nowrap">
                    Seção: {v.electoralSection}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-800 whitespace-nowrap">{v.coordinatorName}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={v.supportStatus} size="sm" />
                </td>
                <td className="px-4 py-3 text-right">
                  <p className="text-slate-800 whitespace-nowrap">
                    {formatDate(v.createdAt)}
                  </p>
                </td>
                <td className="hidden print:table-cell px-4 py-3 border-l border-slate-200 text-center">
                  <div className="w-12 h-4 border border-slate-300 rounded mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
