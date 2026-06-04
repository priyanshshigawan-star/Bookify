import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Hotels from './pages/Hotels'
import Rooms from './pages/Rooms'
import HotelDetail from './pages/HotelDetail'
import RoomDetail from './pages/RoomDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import MyBookings from './pages/MyBookings'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import OwnerDashboard from './pages/owner/Dashboard'
import OwnerHotels from './pages/owner/Hotels'
import OwnerRooms from './pages/owner/Rooms'
import OwnerBookings from './pages/owner/Bookings'
import AddHotel from './pages/owner/AddHotel'
import AddRoom from './pages/owner/AddRoom'

const ProtectedRoute = ({ children, ownerOnly=false }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loader"><div className="spinner"/></div>
  if (!user) return <Navigate to="/login" replace/>
  if (ownerOnly && user.role !== 'owner') return <Navigate to="/" replace/>
  return children
}
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loader"><div className="spinner"/></div>
  if (user) return <Navigate to={user.role==='owner'?'/owner/dashboard':'/'} replace/>
  return children
}

export default function App() {
  const { pathname } = useLocation()
  const isOwner = pathname.startsWith('/owner')
  return (
    <div className="min-h-screen bg-black">
      {!isOwner && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<Hotels/>}/>
        <Route path="/rooms" element={<Rooms/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/hotel/:id" element={<HotelDetail/>}/>
        <Route path="/room/:id" element={<RoomDetail/>}/>
        <Route path="/login" element={<GuestRoute><Login/></GuestRoute>}/>
        <Route path="/signup" element={<GuestRoute><Signup/></GuestRoute>}/>
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings/></ProtectedRoute>}/>
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/owner/dashboard" element={<ProtectedRoute ownerOnly><OwnerDashboard/></ProtectedRoute>}/>
        <Route path="/owner/hotels" element={<ProtectedRoute ownerOnly><OwnerHotels/></ProtectedRoute>}/>
        <Route path="/owner/rooms" element={<ProtectedRoute ownerOnly><OwnerRooms/></ProtectedRoute>}/>
        <Route path="/owner/bookings" element={<ProtectedRoute ownerOnly><OwnerBookings/></ProtectedRoute>}/>
        <Route path="/owner/add-hotel" element={<ProtectedRoute ownerOnly><AddHotel/></ProtectedRoute>}/>
        <Route path="/owner/add-room" element={<ProtectedRoute ownerOnly><AddRoom/></ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
      {!isOwner && <Footer/>}
    </div>
  )
}
