import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const STATUS = { confirmed:'badge-green', pending:'badge-yellow', cancelled:'badge-red' }

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { formatPrice, getImageUrl } = useApp()
  const [searchParams] = useSearchParams()

  const loadBookings = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/bookings/user')
      if (data.success) setBookings(data.bookings)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
    
    // Handle payment success
    const payment = searchParams.get('payment')
    if (payment === 'success') {
      toast.success('Payment successful! Your booking is confirmed.')
      // Reload bookings to reflect updated payment status
      setTimeout(loadBookings, 1000)
      // Clean up URL
      window.history.replaceState({}, document.title, '/my-bookings')
    } else if (payment === 'cancel') {
      toast.error('Payment cancelled. Please try again.')
      window.history.replaceState({}, document.title, '/my-bookings')
    }
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      const { data } = await api.patch(`/bookings/${id}/cancel`)
      if (data.success) {
        setBookings(p => p.map(b => b._id === id ? { ...b, status: 'cancelled' } : b))
        toast.success('Booking cancelled')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    }
  }

  const handlePayNow = async (bookingId) => {
    try {
      const { data } = await api.post('/bookings/stripe-payment', { bookingId })
      if (data.success) {
        window.location.href = data.url // Redirect to Stripe
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment')
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const nights = b => Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000))

  const filterBtn = (f) => ({
    padding: '8px 18px', borderRadius: 20,
    background: filter === f ? 'rgba(201,168,76,0.12)' : '#161929',
    border: `1px solid ${filter === f ? '#c9a84c' : 'rgba(255,255,255,0.08)'}`,
    color: filter === f ? '#c9a84c' : 'rgba(255,255,255,0.6)',
    fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans',sans-serif"
  })

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: '#08090d' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 600 }}>My Bookings</h1>
            <p style={{ color: '#9a9da8', fontSize: 14, marginTop: 6 }}>{bookings.length} total reservations</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={filterBtn(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && <span style={{ background: '#1e2235', padding: '1px 7px', borderRadius: 10, fontSize: 11 }}>{bookings.filter(b => b.status === f).length}</span>}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="page-loader"><div className="spinner" /></div>
          : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 56 }}>🏨</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: '#fff' }}>{filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}</h3>
              <p style={{ color: '#9a9da8' }}>{filter === 'all' ? 'Start exploring our luxury hotels.' : 'Try a different filter.'}</p>
              {filter === 'all' && <a href="/hotels" className="btn btn-gold">Explore Hotels</a>}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filtered.map(b => (
                <div key={b._id} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', background: '#161929', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  <div style={{ position: 'relative', minHeight: 160 }}>
                    <img src={getImageUrl(b.hotel?.image || b.room?.images?.[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ fontSize: 12, color: '#9a9da8', marginBottom: 4 }}>{b.hotel?.hotelName || 'Hotel'}</p>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600 }}>{b.room?.roomType || 'Room'}</h3>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className={`badge ${STATUS[b.status]}`}>{b.status}</span>
                        {b.isPaid && <span className="badge badge-gold">✓ Paid</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                      {[
                        ['Check In', new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                        ['Check Out', new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                        ['Duration', `${nights(b)} Night${nights(b) > 1 ? 's' : ''}`],
                        ['Guests', b.persons],
                        ['Payment', b.paymentMethod],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <p style={{ fontSize: 10, color: '#9a9da8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{l}</p>
                          <p style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    {b.specialRequests && <p style={{ fontSize: 13, color: '#9a9da8', background: '#1e2235', padding: '8px 12px', borderRadius: 8 }}>📝 {b.specialRequests}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <p style={{ fontSize: 11, color: '#9a9da8' }}>Total</p>
                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: '#c9a84c' }}>{formatPrice(b.totalPrice)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        {b.loyaltyPointsEarned > 0 && <span className="badge badge-gold">+{b.loyaltyPointsEarned} pts</span>}
                        <span style={{ fontSize: 11, color: '#6b6f7e', letterSpacing: 1 }}>#{b._id.slice(-8).toUpperCase()}</span>
                        {b.paymentMethod !== 'Pay At Hotel' && !b.isPaid && b.status !== 'cancelled' && <button className="btn btn-gold btn-sm" onClick={() => handlePayNow(b._id)}>Pay Now</button>}
                        {b.status !== 'cancelled' && <button className="btn btn-outline btn-sm" onClick={() => handleCancel(b._id)}>Cancel</button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      <style>{`@media(max-width:640px){div[style*="grid-template-columns: 200px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
