import { create } from 'zustand'
import { userApi, type SystemUser, type SystemUserFormData } from '../../api/user.api'

export type { SystemUser, SystemUserFormData }
export type UserRole = 'admin' | 'coordinator' | 'digitador'
export type UserStatus = 'active' | 'inactive'

interface UsersState {
  users: SystemUser[]
  isLoading: boolean
  error: string | null
  fetch: () => Promise<void>
  addUser: (data: SystemUserFormData) => Promise<void>
  updateUser: (id: string, data: Partial<SystemUserFormData>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error
  if (apiMessage) return apiMessage
  return fallback
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const users = await userApi.getAll()
      set({ users, isLoading: false })
    } catch {
      set({ error: 'Erro ao carregar usuários', isLoading: false })
    }
  },

  addUser: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const newUser = await userApi.create(data)
      set((s) => ({ users: [newUser, ...s.users], isLoading: false }))
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao criar usuário')
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },

  updateUser: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await userApi.update(id, data)
      set((s) => ({
        users: s.users.map((u) => (u.id === id ? updated : u)),
        isLoading: false,
      }))
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao atualizar usuário')
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },

  deleteUser: async (id) => {
    const { users } = get()
    const admins = users.filter((u) => u.role === 'admin' && u.id !== id)
    const target = users.find((u) => u.id === id)
    // Guard: don't delete last admin
    if (target?.role === 'admin' && admins.length === 0) {
      throw new Error('Não é possível excluir o último administrador')
    }
    set({ isLoading: true, error: null })
    try {
      await userApi.delete(id)
      set((s) => ({ users: s.users.filter((u) => u.id !== id), isLoading: false }))
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao excluir usuário')
      set({ error: message, isLoading: false })
      throw new Error(message)
    }
  },
}))
