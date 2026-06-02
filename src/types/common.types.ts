// ─── Common Types ─────────────────────────────────────────────────────────────

export type Status = 'gold' | 'platinum' | 'premium'
export type SupportStatus = 'gold' | 'platinum' | 'premium'
export type RegistrationSource = 'manual' | 'event' | 'referral' | 'digital'
export type ActivityType =
  | 'voter_added'
  | 'voter_edited'
  | 'voter_deleted'
  | 'coordinator_added'
  | 'coordinator_edited'
  | 'coordinator_deleted'
  | 'polling_place_added'
  | 'polling_place_edited'
  | 'polling_place_deleted'

export interface SelectOption {
  label: string
  value: string
}

export interface PaginationState {
  page: number
  perPage: number
  total: number
}

export interface Activity {
  id: string
  type: ActivityType
  description: string
  entityName: string
  userId: string
  createdAt: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
}
