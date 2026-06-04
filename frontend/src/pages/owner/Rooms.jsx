import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { useApp } from '../../context/AppContext'
import OwnerLayout from './OwnerLayout'
import toast from 'react-hot-toast'

export default function OwnerRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const { getImageUrl, formatPrice } = useApp()

  useEffect(() => {
    api.get('/room/owner/list').then(({data})=>{ if(data.success) setRooms(data.rooms) }).catch(()=>toast.error('Failed to load rooms')).finally(()=>setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return
    try { await api.delete(`/room/${id}`); setRooms(p=>p.filter(r=>r._id!==id)); toast.success('Room deleted') }
    catch (err) { toast.error(err.response?.data?.message||'Delete failed') }
  }

  const toggleAvail = async (room) => {
    try {
      await api.put(`/room/${room._id}`,{isAvailable:!room.isAvailable})
      setRooms(p=>p.map(r=>r._id===room._id?{...r,isAvailable:!r.isAvailable}:r))
      toast.success(`Room marked as ${!room.isAvailable?'available':'unavailable'}`)
    } catch { toast.error('Failed to update room') }
  }

  return (
    <OwnerLayout title="My Rooms" subtitle={`${rooms.length} rooms across all hotels`}>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:24}}>
        <Link to="/owner/add-room" className="btn btn-gold">⊕ Add New Room</Link>
      </div>
      {loading ? <div className="page-loader"><div className="spinner"/></div>
      : rooms.length===0 ? (
        <div style={{textAlign:'center',padding:'80px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>No rooms yet</h3>
          <p style={{color:'#9a9da8'}}>Add rooms to your hotels to start accepting bookings.</p>
          <Link to="/owner/add-room" className="btn btn-gold">⊕ Add Room</Link>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {rooms.map(r=>(
            <div key={r._id} style={{display:'grid',gridTemplateColumns:'180px 1fr',background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden',transition:'all 0.3s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,168,76,0.2)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}
            >
              <div style={{minHeight:140}}><img src={getImageUrl(r.images?.[0])} alt={r.roomType} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <div style={{padding:20,display:'flex',flexDirection:'column',gap:10}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
                  <div>
                    <p style={{fontSize:12,color:'#9a9da8',marginBottom:4}}>{r.hotel?.hotelName}</p>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600}}>{r.roomType}</h3>
                    <div style={{display:'flex',gap:12,marginTop:6,flexWrap:'wrap'}}>
                      <span style={{fontSize:12,color:'#9a9da8'}}>👥 {r.maxGuests} guests</span>
                      <span style={{fontSize:12,color:'#9a9da8'}}>🛏 {r.beds} bed{r.beds>1?'s':''}</span>
                      {r.size&&<span style={{fontSize:12,color:'#9a9da8'}}>⊡ {r.size}</span>}
                    </div>
                  </div>
                  <span className={`badge ${r.isAvailable?'badge-green':'badge-red'}`}>{r.isAvailable?'Available':'Unavailable'}</span>
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {r.amenities?.slice(0,4).map(a=><span key={a} style={{fontSize:11,padding:'3px 10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,color:'#9a9da8'}}>{a}</span>)}
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.08)',flexWrap:'wrap',gap:10,marginTop:'auto'}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:'#c9a84c'}}>{formatPrice(r.pricePerNight)}<small style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'#9a9da8',marginLeft:2}}>/night</small></span>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <button className={`btn btn-sm ${r.isAvailable?'btn-dark':'btn-gold'}`} onClick={()=>toggleAvail(r)}>{r.isAvailable?'Mark Unavail.':'Mark Avail.'}</button>
                    <Link to={`/room/${r._id}`} className="btn btn-outline btn-sm">View</Link>
                    <button className="btn btn-dark btn-sm" onClick={()=>handleDelete(r._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@media(max-width:640px){div[style*="grid-template-columns: 180px"]{grid-template-columns:1fr!important}}`}</style>
    </OwnerLayout>
  )
}
