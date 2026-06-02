import { create } from 'zustand'
import { authApi, type AuthUser } from '../../api/auth.api'

const TOKEN_KEY = 'electoral_token'
const USER_KEY = 'electoral_auth_user'

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, remember: boolean) => Promise<boolean>
  logout: () => void
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUser(),
  token: loadToken(),
  isAuthenticated: !!loadToken(),
  isLoading: false,
  error: null,

  login: async (email, password, remember) => {
    set({ isLoading: true, error: null })
    try {
      const { token, user } = await authApi.login(email, password)

      localStorage.setItem(TOKEN_KEY, token)
      if (remember) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
      }

      set({ user, token, isAuthenticated: true, isLoading: false })
      return true
    } catch {
      set({ isLoading: false, error: 'E-mail ou senha inválidos' })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    set({ user: null, token: null, isAuthenticated: false })
  },

  restoreSession: async () => {
    const token = loadToken()
    if (!token) return
    try {
      const user = await authApi.me()
      set({ user, isAuthenticated: true })
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))
