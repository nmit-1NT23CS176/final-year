import { create } from 'zustand'
import { User } from '../../shared/types/user'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockvista_token', token)
      localStorage.setItem('stockvista_user', JSON.stringify(user))
    }
    set({ user, token, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stockvista_token')
      localStorage.removeItem('stockvista_user')
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false })
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('stockvista_token')
        const userStr = localStorage.getItem('stockvista_user')
        if (token && userStr) {
          const user = JSON.parse(userStr) as User
          set({ user, token, isAuthenticated: true, isLoading: false })
          return
        }
      } catch {
        localStorage.removeItem('stockvista_token')
        localStorage.removeItem('stockvista_user')
      }
    }
    set({ isLoading: false })
  },
}))
