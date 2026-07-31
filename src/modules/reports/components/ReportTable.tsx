import { useState, useEffect } from 'react'
import type { EnrichedVoter } from '../reports.types'

interface Props {
  voters: EnrichedVoter[]
}

const STATUS_LABELS: Record<string, string> = {
  gold: 'Gold',
  platinum: 'Platinum',
  premium: 'Premium',
}

const STATUS_CLASSES: Record<string, string> = {
  gold: 'bg-amber-100 text-amber-700',
  platinum: 'bg-slate-100 text-slate-600',
  premium: 'bg-purple-100 text-purple-700',
}

export function ReportTable({ voters }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setCurrentPage(1), 0)
    return () => window.clearTimeout(timeoutId)
  }, [voters])

  if (voters.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center text-slate-400">
        Nenhum eleitor encontrado com os filtros aplicados.
      </div>
    )
  }

  const totalPages = Math.ceil(voters.length / itemsPerPage)
  const paginatedVoters = voters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Nome</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">WhatsApp</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Coordenador</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Local de Votação</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Zona / Seção</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Região</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVoters.map((voter, idx) => (
              <tr
                key={voter.id}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-50/40'}`}
              >
                <td className="px-4 py-3 font-medium text-slate-800">{voter.name}</td>
                <td className="px-4 py-3 text-slate-500">{voter.whatsapp || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{voter.coordinatorName}</td>
                <td className="px-4 py-3 text-slate-600">{voter.pollingPlaceName}</td>
                <td className="px-4 py-3 text-slate-500">
                  {voter.electoralZone || '—'} / {voter.electoralSection || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_CLASSES[voter.supportStatus] ?? 'bg-slate-100 text-slate-500'}`}>
                    {STATUS_LABELS[voter.supportStatus] ?? voter.supportStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{voter.region || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, voters.length)} de {voters.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm font-medium text-slate-700 px-3">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
