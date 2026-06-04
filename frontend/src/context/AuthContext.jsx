import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookify_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get('/user/me')
        if (data.success) { setUser(data.user); localStorage.setItem('bookify_user', JSON.stringify(data.user)) }
      } catch {
        setUser(null); localStorage.removeItem('bookify_user')
      } finally { setLoading(false) }
    }
    verify()
  }, [])

  const signup = useCallback(async (formData) => {
    setAuthLoading(true)
    try {
      const { data } = await api.post('/user/signup', formData)
      if (data.success) {
        setUser(data.user)
        localStorage.setItem('bookify_user', JSON.stringify(data.user))
        toast.success(data.message)
        return { success: true, role: data.user.role }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed'
      toast.error(msg)
      return { success: false, message: msg }
    } finally { setAuthLoading(false) }
  }, [])

  const login = useCallback(async (formData) => {
    setAuthLoading(true)
    try {
      const { data } = await api.post('/user/login', formData)
      if (data.success) {
        setUser(data.user)
        localStorage.setItem('bookify_user', JSON.stringify(data.user))
        toast.success(data.message)
        return { success: true, role: data.user.role }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      return { success: false, message: msg }
    } finally { setAuthLoading(false) }
  }, [])

  const logout = useCallback(async () => {
    try { await api.post('/user/logout') } catch {}
    setUser(null)
    localStorage.removeItem('bookify_user')
    toast.success('Logged out successfully')
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/user/me')
      if (data.success) { setUser(data.user); localStorage.setItem('bookify_user', JSON.stringify(data.user)) }
    } catch {}
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, authLoading, signup, login, logout, refreshUser, isOwner: user?.role === 'owner' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
