import { createContext, useContext, useState, useCallback } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const [hotelsLoading, setHotelsLoading] = useState(false)
  const [roomsLoading, setRoomsLoading] = useState(false)
  const currency = '$'

  const fetchHotels = useCallback(async (params = {}) => {
    setHotelsLoading(true)
    try {
      const { data } = await api.get('/hotel/all', { params })
      if (data.success) setHotels(data.hotels)
      return data.hotels
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load hotels')
      return []
    } finally { setHotelsLoading(false) }
  }, [])

  const fetchRooms = useCallback(async (params = {}) => {
    setRoomsLoading(true)
    try {
      const { data } = await api.get('/room/all', { params })
      if (data.success) setRooms(data.rooms)
      return data.rooms
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load rooms')
      return []
    } finally { setRoomsLoading(false) }
  }, [])

  const getImageUrl = (filename) => {
    if (!filename) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
    if (filename.startsWith('http')) return filename
    return `/images/${filename}`
  }

  const formatPrice = (price) => `${currency}${Number(price).toLocaleString()}`

  const calcNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    return Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 3600 * 24)))
  }

  return (
    <AppContext.Provider value={{
      hotels, rooms, hotelsLoading, roomsLoading,
      fetchHotels, fetchRooms, getImageUrl, formatPrice, calcNights, currency
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
