import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import RoomCard from '../components/RoomCard'

const ROOM_TYPES = ['All', 'Deluxe Room', 'Superior Room', 'Suite', 'Junior Suite', 'Presidential Suite', 'Penthouse', 'Studio', 'Family Room', 'Executive Room']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function Rooms() {
  const { fetchRooms, rooms, roomsLoading } = useApp()
  const [searchParams] = useSearchParams()
  const [roomType, setRoomType] = useState('All')
  const [sort, setSort] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [search, setSearch] = useState('')
  const [availOnly, setAvailOnly] = useState(false)

  useEffect(() => {
    const params = {}
    if (availOnly) params.available = 'true'
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    if (roomType !== 'All') params.roomType = roomType
    fetchRooms(params)
  }, [roomType, availOnly, minPrice, maxPrice])

  const filtered = rooms
    .filter(r => !search || r.roomType?.toLowerCase().includes(search.toLowerCase()) || r.hotel?.hotelName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price_asc') return a.pricePerNight - b.pricePerNight
      if (sort === 'price_desc') return b.pricePerNight - a.pricePerNight
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const S = { // inline styles helper
    page: { paddingTop: 80, minHeight: '100vh', background: '#08090d' },
    header: { background: 'linear-gradient(135deg,#0e1120 0%,#161929 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '60px 0 40px' },
    container: { maxWidth: 1280, margin: '0 auto', padding: '0 24px' },
    sidebar: { background: '#161929', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, height: 'fit-content', position: 'sticky', top: 100 },
    sectionLabel: { fontSize: 11, color: '#9a9da8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, fontFamily: "'DM Sans',sans-serif" },
    filterBtn: (active) => ({ width: '100%', textAlign: 'left', background: active ? 'rgba(201,168,76,0.12)' : 'none', border: '1px solid', borderColor: active ? '#c9a84c' : 'transparent', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: active ? '#c9a84c' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 4 }),
    card: { display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.container}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 8 }}>Browse</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 600 }}>All Rooms</h1>
              <p style={{ color: '#9a9da8', fontSize: 14, marginTop: 6 }}>{filtered.length} rooms available</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input type="text" placeholder="Search rooms or hotels…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: 180, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...S.container, paddingTop: 40, paddingBottom: 80 }}>
        {/* Room type pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {ROOM_TYPES.map(t => (
            <button key={t} onClick={() => setRoomType(t)} style={{ padding: '7px 18px', borderRadius: 20, background: roomType === t ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${roomType === t ? '#c9a84c' : 'rgba(255,255,255,0.08)'}`, color: roomType === t ? '#c9a84c' : 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>
          {/* Sidebar */}
          <aside style={S.sidebar}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Filters</h3>

            <div style={{ marginBottom: 24 }}>
              <p style={S.sectionLabel}>Price Per Night</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ fontSize: 13, padding: '8px 10px' }} />
                <span style={{ color: '#9a9da8', flexShrink: 0 }}>—</span>
                <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ fontSize: 13, padding: '8px 10px' }} />
              </div>
            </div>

            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={S.sectionLabel}>Availability</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} style={{ width: 'auto', accentColor: '#c9a84c' }} />
                Available rooms only
              </label>
            </div>

            <div>
              <p style={S.sectionLabel}>Room Type</p>
              {ROOM_TYPES.slice(1).map(t => (
                <button key={t} onClick={() => setRoomType(t)} style={S.filterBtn(roomType === t)}>{t}</button>
              ))}
              {roomType !== 'All' && (
                <button onClick={() => setRoomType('All')} style={{ fontSize: 12, color: '#c9a84c', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, textDecoration: 'underline' }}>Clear filter</button>
              )}
            </div>
          </aside>

          {/* Grid */}
          <main>
            {roomsLoading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9a9da8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 56 }}>🛏</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: '#fff' }}>No Rooms Found</h3>
                <p>Try adjusting your filters.</p>
                <button className="btn btn-gold" onClick={() => { setRoomType('All'); setMinPrice(''); setMaxPrice(''); setAvailOnly(false); setSearch('') }}>Clear All Filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
                {filtered.map((r, i) => (
                  <div key={r._id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <RoomCard room={r} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <style>{`@media(max-width:900px){.rooms-layout{grid-template-columns:1fr!important}aside{position:static!important}}`}</style>
    </div>
  )
}
