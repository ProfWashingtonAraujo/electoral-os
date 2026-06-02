import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { PollingPlace, PollingPlaceFormData } from '../../types/polling-place.types'
import type { Activity, ActivityType } from '../../types/common.types'
import { pollingPlaceApi } from '../../api/pollingPlace.api'

const LS_ACTIVITIES = 'electoral_activities_v3'

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
    description: type === 'polling_place_added' ? 'Novo local de votação cadastrado'
      : type === 'polling_place_edited' ? 'Local de votação atualizado'
      : 'Local de votação removido',
    entityName: name,
    userId: 'user-admin',
    createdAt: new Date().toISOString(),
  }
}

interface PollingPlacesState {
  pollingPlaces: PollingPlace[]
  activities: Activity[]
  isLoading: boolean
  error: string | null
  fetch: () => Promise<void>
  add: (data: PollingPlaceFormData) => Promise<PollingPlace>
  update: (id: string, data: Partial<PollingPlaceFormData>) => Promise<void>
  remove: (id: string) => Promise<void>
  getById: (id: string) => PollingPlace | undefined
}

export const usePollingPlacesStore = create<PollingPlacesState>((set, get) => ({
  pollingPlaces: [],
  activities: loadActivities(),
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const pollingPlaces = await pollingPlaceApi.getAll()
      set({ pollingPlaces, isLoading: false })
    } catch (error) {
      set({ error: 'Erro ao carregar locais de votação', isLoading: false })
    }
  },

  add: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const pollingPlace = await pollingPlaceApi.create(data)
      set((state) => {
        const updatedPlaces = [pollingPlace, ...state.pollingPlaces]
        const updatedActs = [makeActivity('polling_place_added', pollingPlace.name), ...state.activities].slice(0, 50)
        saveActivities(updatedActs)
        return { pollingPlaces: updatedPlaces, activities: updatedActs, isLoading: false }
      })
      return pollingPlace
    } catch (error) {
      set({ error: 'Erro ao adicionar local de votação', isLoading: false })
      throw error
    }
  },

  update: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await pollingPlaceApi.update(id, data)
      set((state) => {
        const updatedPlaces = state.pollingPlaces.map((p) => (p.id === id ? updated : p))
        const updatedActs = [makeActivity('polling_place_edited', updated.name), ...state.activities].slice(0, 50)
        saveActivities(updatedActs)
        return { pollingPlaces: updatedPlaces, activities: updatedActs, isLoading: false }
      })
    } catch (error) {
      set({ error: 'Erro ao atualizar local de votação', isLoading: false })
      throw error
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null })
    const place = get().pollingPlaces.find((p) => p.id === id)
    try {
      await pollingPlaceApi.delete(id)
      set((state) => {
        const updatedPlaces = state.pollingPlaces.filter((p) => p.id !== id)
        const updatedActs = place
          ? [makeActivity('polling_place_deleted', place.name), ...state.activities].slice(0, 50)
          : state.activities
        saveActivities(updatedActs)
        return { pollingPlaces: updatedPlaces, activities: updatedActs, isLoading: false }
      })
    } catch (error) {
      set({ error: 'Erro ao remover local de votação', isLoading: false })
      throw error
    }
  },

  getById: (id) => get().pollingPlaces.find((p) => p.id === id),
}))
