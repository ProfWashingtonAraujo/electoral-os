import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { EnrichedVoter, ReportFiltersState } from '../reports.types'
import { SUPPORT_STATUS_OPTIONS } from '../../../constants/options'
import { formatDate } from '../../../utils/formatters'

export function exportReportPDF(
  voters: EnrichedVoter[],
  filters: ReportFiltersState,
  exportedBy?: { name?: string; email?: string; role?: string }
) {
  // Use landscape since we have 11 columns
  const doc = new jsPDF('landscape')
  
  doc.setFontSize(16)
  doc.text('Relatorio Analitico de Eleitores', 14, 20)
  
  doc.setFontSize(9)
  doc.setTextColor(100)
  doc.text(`Total de eleitores no relatorio: ${voters.length}`, 14, 28)
  const exportedAt = new Date().toLocaleString('pt-BR')
  doc.text(`Exportado por: ${exportedBy?.name ?? 'Usuário'} (${exportedBy?.email ?? '-'})`, 14, 32)
  doc.text(`Data/Hora da exportação: ${exportedAt}`, 14, 36)
  
  // Add filter text if applied
  let filterText = 'Filtros aplicados: '
  const applied = []
  if (filters.searchTerm) applied.push(`Busca: "${filters.searchTerm}"`)
  if (filters.period !== 'all') applied.push(`Periodo: ${filters.period}`)
  if (filters.coordinatorId) applied.push('Coordenador especifico')
  if (filters.supportStatus) applied.push(`Status: ${filters.supportStatus}`)
  if (filters.region) applied.push(`Municipio: ${filters.region}`)
  if (filters.pollingPlaceId) applied.push('Local de Votacao especifico')
  if (filters.electoralSection) applied.push(`Secao: ${filters.electoralSection}`)
  
  if (applied.length > 0) {
    doc.text(filterText + applied.join(', '), 14, 42)
  } else {
    doc.text('Filtros aplicados: Nenhum (Todos os dados)', 14, 42)
  }

  const tableData = voters.map((v) => [
    v.name,
    v.coordinatorName,
    v.whatsapp,
    v.neighborhood,
    v.region,
    v.pollingPlaceName,
    v.electoralZone,
    v.electoralSection,
    SUPPORT_STATUS_OPTIONS.find(o => o.value === v.supportStatus)?.label || v.supportStatus,
    formatDate(v.createdAt),
    '' // Status 2 (last column)
  ])
  
  autoTable(doc, {
    startY: 48,
    head: [['Nome', 'Coordenador', 'WhatsApp', 'Bairro', 'Municipio', 'Local Votacao', 'Zona', 'Secao', 'Status', 'Data', 'Status 2']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], fontSize: 7 }, // navy-800
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 25 },
      5: { cellWidth: 35 },
    }
  })

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page)
    doc.setFontSize(8)
    doc.setTextColor(120)
    doc.text(
      `Documento exportado por ${exportedBy?.name ?? 'Usuário'} em ${exportedAt}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    )
  }
  
  doc.save('relatorio-analitico-eleitores.pdf')
}
