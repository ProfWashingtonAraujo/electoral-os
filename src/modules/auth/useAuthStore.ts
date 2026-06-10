import { create } from 'zustand'
import { authApi, type AuthUser } from '../../api/auth.api'

const TOKEN_KEY = 'electoral_token'
const USER_KEY = 'electoral_auth_user'

function clearLegacyAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function loadUser(): AuthUser | null {
  try {
    clearLegacyAuthStorage()
    const raw = sessionStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadToken(): string | null {
  clearLegacyAuthStorage()
  return sessionStorage.getItem(TOKEN_KEY)
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  token: loadToken(),
  isAuthenticated: !!loadToken(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const { token, user } = await authApi.login(email, password)

      clearLegacyAuthStorage()
      sessionStorage.setItem(TOKEN_KEY, token)
      sessionStorage.setItem(USER_KEY, JSON.stringify(user))

      set({ user, token, isAuthenticated: true, isLoading: false })
      return true
    } catch {
      set({ isLoading: false, error: 'E-mail ou senha inválidos' })
      return false
    }
  },

  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    clearLegacyAuthStorage()
    set({ user: null, token: null, isAuthenticated: false })
  },

  restoreSession: async () => {
    const token = loadToken()
    if (!token) return
    try {
      const user = await authApi.me()
      set({ user, token, isAuthenticated: true })
      sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch {
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
      clearLegacyAuthStorage()
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))
