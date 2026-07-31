import { create } from 'zustand'
import type { Coordinator, CoordinatorFormData } from '../../types/coordinator.types'
import { coordinatorApi } from '../../api/coordinator.api'

interface CoordinatorsState {
  coordinators: Coordinator[]
  isLoading: boolean
  error: string | null
  fetch: () => Promise<void>
  fetchById: (id: string) => Promise<Coordinator>
  add: (data: CoordinatorFormData) => Promise<Coordinator>
  update: (id: string, data: Partial<CoordinatorFormData>) => Promise<void>
  remove: (id: string) => Promise<void>
  getById: (id: string) => Coordinator | undefined
}

export const useCoordinatorsStore = create<CoordinatorsState>((set, get) => ({
  coordinators: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const coordinators = await coordinatorApi.getAll()
      set({ coordinators, isLoading: false })
    } catch {
      set({ error: 'Erro ao carregar coordenadores', isLoading: false })
    }
  },

  fetchById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const coordinator = await coordinatorApi.getById(id)
      set((state) => ({
        coordinators: state.coordinators.some((c) => c.id === id)
          ? state.coordinators.map((c) => (c.id === id ? { ...c, ...coordinator } : c))
          : [coordinator, ...state.coordinators],
        isLoading: false,
      }))
      return coordinator
    } catch (error) {
      set({ error: 'Erro ao carregar coordenador', isLoading: false })
      throw error
    }
  },

  add: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const coordinator = await coordinatorApi.create(data)
      set((state) => ({ 
        coordinators: [coordinator, ...state.coordinators],
        isLoading: false 
      }))
      return coordinator
    } catch (error) {
      set({ error: 'Erro ao adicionar coordenador', isLoading: false })
      throw error
    }
  },

  update: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await coordinatorApi.update(id, data)
      set((state) => ({
        coordinators: state.coordinators.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Erro ao atualizar coordenador', isLoading: false })
      throw error
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await coordinatorApi.delete(id)
      set((state) => ({
        coordinators: state.coordinators.filter((c) => c.id !== id),
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Erro ao remover coordenador', isLoading: false })
      throw error
    }
  },

  getById: (id) => get().coordinators.find((c) => c.id === id),
}))
