/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../services/authService'

interface AuthContextType {
  isAuthenticated: boolean
  user: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialToken = authService.getToken()
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialToken))
  const [user, setUser] = useState<string | null>(initialToken ? 'User' : null)
  const [isLoading] = useState(false)

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password })
    setIsAuthenticated(true)
    setUser(response.username)
  }

  const register = async (username: string, email: string, password: string) => {
    const response = await authService.register({ username, email, password })
    setIsAuthenticated(true)
    setUser(response.username)
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
