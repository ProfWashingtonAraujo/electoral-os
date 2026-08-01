import type { SupportStatus, RegistrationSource } from './common.types'

export interface Voter {
  id: string
  name: string
  phone?: string
  whatsapp: string
  coordinatorId: string
  address: string
  neighborhood: string
  city?: string
  region: string
  voterRegistration: string
  electoralZone: string
  electoralSection: string
  pollingPlaceId: string
  supportStatus: SupportStatus
  notes?: string
  registrationSource: RegistrationSource
  status?: string
  createdAt: string
  updatedAt: string
}

export type VoterFormData = Omit<Voter, 'id' | 'createdAt' | 'updatedAt'>
