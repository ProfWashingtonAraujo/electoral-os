export interface PollingPlace {
  id: string
  name: string
  address: string
  neighborhood: string
  region: string
  electoralZone: string
  sections: string[]
}

export type PollingPlaceFormData = Omit<PollingPlace, 'id'>
