import type { Voter } from '../../types/voter.types'

export interface ReportFiltersState {
  searchTerm: string
  coordinatorId: string
  region: string
  pollingPlaceId: string
  electoralZone: string
  electoralSection: string
  supportStatus: string
  period: string
}

export const initialReportFilters: ReportFiltersState = {
  searchTerm: '',
  coordinatorId: '',
  region: '',
  pollingPlaceId: '',
  electoralZone: '',
  electoralSection: '',
  supportStatus: '',
  period: 'all',
}

export interface EnrichedVoter extends Voter {
  coordinatorName: string
  pollingPlaceName: string
}
