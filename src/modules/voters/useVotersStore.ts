import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Voter, VoterFormData } from '../../types/voter.types'
import type { Activity, ActivityType } from '../../types/common.types'
import { voterApi } from '../../api/voter.api'
import type { VotersStatsResponse } from '../../api/voter.api'

const LS_ACTIVITIES = 'electoral_activities'

function loadActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(LS_ACTIVITIES)
    return raw ? (JSON.parse(raw) as Activity[]) : []
  } catch { return [] }
}

function saveActivities(data: Activity[]) {
  localStorage.setItem(LS_ACTIVITIES, JSON.stringify(data))
}

function makeActivity(type: ActivityType, name: string): Activity {
  return {
    id: uuidv4(),
    type,
    description: type === 'voter_added' ? 'Novo eleitor cadastrado'
      : type === 'voter_edited' ? 'Eleitor atualizado'
      : 'Eleitor removido',
    entityName: name,
    userId: 'user-admin',
    createdAt: new Date().toISOString(),
  }
}

interface VotersState {
  voters: Voter[]
  total: number
  page: number
  perPage: number
  stats: VotersStatsResponse | null
  activities: Activity[]
  isLoading: boolean
  error: string | null
  fetch: (query?: {
    coordinatorId?: string
    pollingPlaceId?: string
    search?: string
    region?: string
    neighborhood?: string
    supportStatus?: string
    status?: string
    page?: number
    perPage?: number
  }) => Promise<void>
  fetchStats: (period?: '30d' | '90d' | 'all') => Promise<void>
  fetchAll: (query?: {
    coordinatorId?: string
    pollingPlaceId?: string
    search?: string
    region?: string
    neighborhood?: string
    supportStatus?: string
    status?: string
  }) => Promise<void>
  add: (data: VoterFormData) => Promise<Voter>
  update: (id: string, data: Partial<VoterFormData>) => Promise<void>
  remove: (id: string) => Promise<void>
  getById: (id: string) => Voter | undefined
}

export const useVotersStore = create<VotersState>((set, get) => ({
  voters: [],
  total: 0,
  page: 1,
  perPage: 25,
  stats: null,
  activities: loadActivities(),
  isLoading: false,
  error: null,

  fetch: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      const res = await voterApi.getAll(filters)
      set({ voters: res.items, total: res.total, page: res.page, perPage: res.perPage, isLoading: false })
    } catch (error) {
      set({ error: 'Erro ao carregar eleitores', isLoading: false })
    }
  },

  fetchStats: async (period) => {
    try {
      const stats = await voterApi.getStats(period)
      set({ stats })
    } catch {
      // keep stats null; UI can fall back
    }
  },

  fetchAll: async (query) => {
    set({ isLoading: true, error: null })
    try {
      const perPage = 200
      let page = 1
      let all: Voter[] = []
      // Fetch pages until completion. For 25k, this is ~125 requests max.
      // Only used in places like Reports where full dataset is required.
      while (true) {
        const res = await voterApi.getAll({ ...query, page, perPage })
        all = all.concat(res.items)
        if (all.length >= res.total || res.items.length === 0) {
          set({ voters: all, total: res.total, page: 1, perPage, isLoading: false })
          return
        }
        page++
      }
    } catch {
      set({ error: 'Erro ao carregar eleitores', isLoading: false })
    }
  },

  add: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const voter = await voterApi.create(data)
      set((state) => {
        const updatedVoters = [voter, ...state.voters]
        const updatedActs = [makeActivity('voter_added', voter.name), ...state.activities].slice(0, 50)
        saveActivities(updatedActs)
        const newTotal = state.total + 1
        const newStats = state.stats ? { ...state.stats, total: state.stats.total + 1 } : null
        return { 
          voters: updatedVoters, 
          activities: updatedActs, 
          total: newTotal,
          stats: newStats,
          isLoading: false 
        }
      })
      return voter
    } catch (error) {
      set({ error: 'Erro ao adicionar eleitor', isLoading: false })
      throw error
    }
  },

  update: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await voterApi.update(id, data)
      set((state) => {
        const updatedVoters = state.voters.map((v) => (v.id === id ? updated : v))
        const updatedActs = [makeActivity('voter_edited', updated.name), ...state.activities].slice(0, 50)
        saveActivities(updatedActs)
        return { voters: updatedVoters, activities: updatedActs, isLoading: false }
      })
    } catch (error) {
      set({ error: 'Erro ao atualizar eleitor', isLoading: false })
      throw error
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null })
    const voter = get().voters.find((v) => v.id === id)
    try {
      await voterApi.delete(id)
      set((state) => {
        const updatedVoters = state.voters.filter((v) => v.id !== id)
        const updatedActs = voter
          ? [makeActivity('voter_deleted', voter.name), ...state.activities].slice(0, 50)
          : state.activities
        saveActivities(updatedActs)
        const newTotal = Math.max(0, state.total - 1)
        const newStats = state.stats ? { ...state.stats, total: Math.max(0, state.stats.total - 1) } : null
        return { 
          voters: updatedVoters, 
          activities: updatedActs, 
          total: newTotal,
          stats: newStats,
          isLoading: false 
        }
      })
    } catch (error) {
      set({ error: 'Erro ao remover eleitor', isLoading: false })
      throw error
    }
  },

  getById: (id) => get().voters.find((v) => v.id === id),
}))
