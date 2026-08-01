import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { EnrichedVoter } from '../reports.types'
import type { ReportFiltersState } from '../reports.types'

interface UserInfo {
  name?: string
  email?: string
  role?: string
}

const SUPPORT_STATUS_LABELS: Record<string, string> = {
  gold: 'Gold',
  platinum: 'Platinum',
  premium: 'Premium',
}

const VOTER_STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
}

function formatDate(value?: string) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('pt-BR')
}

export function exportReportPDF(
  voters: EnrichedVoter[],
  filters: ReportFiltersState,
  user: UserInfo
) {
  const doc = new jsPDF({ orientation: 'landscape' })

  // Cabeçalho
  doc.setFontSize(18)
  doc.setTextColor(30, 64, 175) // blue-800
  doc.text('Relatório de Eleitores', 14, 18)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 25)
  if (user.name) doc.text(`Usuário: ${user.name} (${user.email ?? ''})`, 14, 31)
  doc.text(`Total de registros: ${voters.length}`, 14, 37)

  // Filtros aplicados
  const activeFilters: string[] = []
  if (filters.searchTerm) activeFilters.push(`Busca: "${filters.searchTerm}"`)
  if (filters.period !== 'all') activeFilters.push(`Período: ${filters.period}`)
  if (filters.supportStatus) activeFilters.push(`Status: ${filters.supportStatus}`)
  if (filters.region) activeFilters.push(`Região: ${filters.region}`)
  if (filters.electoralZone) activeFilters.push(`Zona: ${filters.electoralZone}`)
  if (filters.electoralSection) activeFilters.push(`Seção: ${filters.electoralSection}`)

  if (activeFilters.length > 0) {
    doc.text(`Filtros: ${activeFilters.join(' | ')}`, 14, 43)
  }

  // Tabela
  autoTable(doc, {
    startY: activeFilters.length > 0 ? 50 : 44,
    head: [[
      'Nome',
      'Coordenador',
      'WhatsApp',
      'Bairro',
      'Município',
      'Local Votação',
      'Zona',
      'Seção',
      'Status',
      'Data',
      'Status 2',
    ]],
    body: voters.map((v) => [
      v.name,
      v.coordinatorName,
      v.whatsapp || '-',
      v.neighborhood || '-',
      v.city || v.region || '-',
      v.pollingPlaceName,
      v.electoralZone || '-',
      v.electoralSection || '-',
      SUPPORT_STATUS_LABELS[v.supportStatus] ?? v.supportStatus,
      formatDate(v.createdAt),
      VOTER_STATUS_LABELS[v.status ?? ''] ?? v.status ?? '-',
    ]),
    styles: { fontSize: 7, cellPadding: 1.8, overflow: 'linebreak' },
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: 28 },
      2: { cellWidth: 24 },
      3: { cellWidth: 26 },
      4: { cellWidth: 25 },
      5: { cellWidth: 43 },
      6: { cellWidth: 13 },
      7: { cellWidth: 14 },
      8: { cellWidth: 18 },
      9: { cellWidth: 18 },
      10: { cellWidth: 18 },
    },
  })

  doc.save(`relatorio-eleitores-${Date.now()}.pdf`)
}
