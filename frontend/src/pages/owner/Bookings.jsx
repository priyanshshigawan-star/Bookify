import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { useApp } from '../../context/AppContext'
import OwnerLayout from './OwnerLayout'
import toast from 'react-hot-toast'

const STATUS = {confirmed:'badge-green',pending:'badge-yellow',cancelled:'badge-red'}

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { formatPrice } = useApp()

  useEffect(() => {
    api.get('/bookings/hotel').then(({data})=>{ if(data.success) setBookings(data.bookings) }).catch(()=>toast.error('Failed to load')).finally(()=>setLoading(false))
  }, [])

  const handleStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/bookings/${id}/status`,{status})
      if(data.success) { setBookings(p=>p.map(b=>b._id===id?{...b,status}:b)); toast.success(`Booking ${status}`) }
    } catch { toast.error('Failed to update') }
  }

  const filtered = bookings
    .filter(b=>filter==='all'||b.status===filter)
    .filter(b=>!search||b.user?.name?.toLowerCase().includes(search.toLowerCase())||b.hotel?.hotelName?.toLowerCase().includes(search.toLowerCase()))

  const nights = b => Math.max(1,Math.ceil((new Date(b.checkOut)-new Date(b.checkIn))/86400000))
  const totalRev = bookings.filter(b=>b.status!=='cancelled').reduce((s,b)=>s+b.totalPrice,0)

  const fBtn = (f) => ({padding:'7px 16px',borderRadius:20,background:filter===f?'rgba(201,168,76,0.12)':'#1e2235',border:`1px solid ${filter===f?'#c9a84c':'rgba(255,255,255,0.08)'}`,color:filter===f?'#c9a84c':'rgba(255,255,255,0.6)',fontSize:13,cursor:'pointer',transition:'all 0.2s',fontFamily:"'DM Sans',sans-serif"})

  return (
    <OwnerLayout title="Bookings" subtitle={`${bookings.length} total reservations`}>
      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[
          {l:'Total',v:bookings.length,c:'#fff'},
          {l:'Confirmed',v:bookings.filter(b=>b.status==='confirmed').length,c:'#4ec994'},
          {l:'Pending',v:bookings.filter(b=>b.status==='pending').length,c:'#c9874c'},
          {l:'Revenue',v:formatPrice(totalRev),c:'#c9a84c'},
        ].map(s=>(
          <div key={s.l} style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'16px 20px'}}>
            <span style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px',display:'block',marginBottom:4}}>{s.l}</span>
            <strong style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:s.c}}>{s.v}</strong>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
        <input placeholder="Search by guest or hotel…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,minWidth:220}}/>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {['all','confirmed','pending','cancelled'].map(f=><button key={f} onClick={()=>setFilter(f)} style={fBtn(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>)}
        </div>
      </div>

      {loading ? <div className="page-loader"><div className="spinner"/></div>
      : filtered.length===0 ? (
        <div style={{textAlign:'center',padding:60,color:'#9a9da8'}}><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:'#fff',marginBottom:8}}>No bookings found</h3><p>Try adjusting your filters.</p></div>
      ) : (
        <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden',overflowX:'auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1.5fr 1.5fr 1.3fr 0.8fr 0.8fr 1fr 1.2fr',gap:12,padding:'12px 20px',background:'#1e2235',fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px',minWidth:800}}>
            {['Guest','Hotel · Room','Dates','Nights','Amount','Status','Actions'].map(h=><span key={h}>{h}</span>)}
          </div>
          {filtered.map(b=>(
            <div key={b._id} style={{display:'grid',gridTemplateColumns:'1.5fr 1.5fr 1.3fr 0.8fr 0.8fr 1fr 1.2fr',gap:12,padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',fontSize:13,alignItems:'center',minWidth:800,transition:'background 0.2s'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div><strong style={{display:'block',fontSize:14}}>{b.user?.name||'—'}</strong><span style={{color:'#9a9da8',fontSize:11}}>{b.user?.email}</span></div>
              <div><strong>{b.hotel?.hotelName}</strong><span style={{color:'#9a9da8',fontSize:12,display:'block'}}>{b.room?.roomType}</span></div>
              <div style={{fontSize:12}}>
                <div>{new Date(b.checkIn).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
                <div style={{color:'#9a9da8'}}>→ {new Date(b.checkOut).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
              </div>
              <span>{nights(b)}</span>
              <span style={{color:'#c9a84c',fontFamily:"'Cormorant Garamond',serif",fontSize:16}}>${b.totalPrice}</span>
              <span className={`badge ${STATUS[b.status]}`}>{b.status}</span>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {b.status==='pending'&&<button className="btn btn-sm" style={{background:'rgba(78,201,148,0.12)',color:'#4ec994',border:'1px solid rgba(78,201,148,0.25)'}} onClick={()=>handleStatus(b._id,'confirmed')}>✓ Confirm</button>}
                {b.status!=='cancelled'&&<button className="btn btn-sm" style={{background:'rgba(201,76,76,0.1)',color:'#e47a7a',border:'1px solid rgba(201,76,76,0.2)'}} onClick={()=>handleStatus(b._id,'cancelled')}>✕ Cancel</button>}
                {b.status==='cancelled'&&<span style={{color:'#6b6f7e',fontSize:12}}>—</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </OwnerLayout>
  )
}
