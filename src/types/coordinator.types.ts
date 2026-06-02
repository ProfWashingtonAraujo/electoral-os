import type { Status } from './common.types'

export interface Coordinator {
  id: string
  name: string
  phone: string
  whatsapp: string
  region: string
  neighborhood: string
  voterRegistration: string
  pollingPlaceId: string
  pollingPlaceName?: string
  electoralZone: string
  electoralSection: string
  voterCount: number
  status: Status
  notes?: string
  createdAt: string
  updatedAt: string
}

export type CoordinatorFormData = Omit<Coordinator, 'id' | 'voterCount' | 'createdAt' | 'updatedAt'>
