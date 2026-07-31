import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { EnrichedVoter } from '../reports.types'
import type { ReportFiltersState } from '../reports.types'

interface UserInfo {
  name?: string
  email?: string
  role?: string
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
    head: [['Nome', 'WhatsApp', 'Coordenador', 'Local de Votação', 'Zona/Seção', 'Status', 'Região']],
    body: voters.map((v) => [
      v.name,
      v.whatsapp || '—',
      v.coordinatorName,
      v.pollingPlaceName,
      `${v.electoralZone || '—'} / ${v.electoralSection || '—'}`,
      v.supportStatus,
      v.region || '—',
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [241, 245, 249] },
  })

  doc.save(`relatorio-eleitores-${Date.now()}.pdf`)
}
