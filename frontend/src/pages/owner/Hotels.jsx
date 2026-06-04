import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { useApp } from '../../context/AppContext'
import OwnerLayout from './OwnerLayout'
import toast from 'react-hot-toast'

export default function OwnerHotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const { getImageUrl, formatPrice } = useApp()

  useEffect(() => {
    api.get('/hotel/owner/list').then(({data})=>{ if(data.success) setHotels(data.hotels) }).catch(()=>toast.error('Failed to load hotels')).finally(()=>setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return
    try { await api.delete(`/hotel/${id}`); setHotels(p=>p.filter(h=>h._id!==id)); toast.success('Hotel deleted') }
    catch (err) { toast.error(err.response?.data?.message||'Delete failed') }
  }

  return (
    <OwnerLayout title="My Hotels" subtitle={`${hotels.length} properties listed`}>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:24}}>
        <Link to="/owner/add-hotel" className="btn btn-gold">⊕ Add New Hotel</Link>
      </div>
      {loading ? <div className="page-loader"><div className="spinner"/></div>
      : hotels.length===0 ? (
        <div style={{textAlign:'center',padding:'80px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:'#fff'}}>No hotels yet</h3>
          <p style={{color:'#9a9da8'}}>Start by listing your first property on Bookify.</p>
          <Link to="/owner/add-hotel" className="btn btn-gold">⊕ Add Hotel</Link>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {hotels.map(h=>(
            <div key={h._id} style={{display:'grid',gridTemplateColumns:'200px 1fr',background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,overflow:'hidden',transition:'all 0.3s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,168,76,0.2)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}
            >
              <div style={{height:160}}><img src={getImageUrl(h.image)} alt={h.hotelName} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <div style={{padding:20,display:'flex',flexDirection:'column',gap:12}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16}}>
                  <div>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,marginBottom:4}}>{h.hotelName}</h3>
                    <p style={{fontSize:13,color:'#9a9da8'}}>📍 {h.hotelAddress}{h.city?`, ${h.city}`:''}</p>
                  </div>
                  <span className="badge badge-gold">★ {h.rating?.toFixed(1)}</span>
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {h.amenities?.slice(0,5).map(a=><span key={a} style={{fontSize:11,padding:'3px 10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,color:'#9a9da8'}}>{a}</span>)}
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:12,borderTop:'1px solid rgba(255,255,255,0.08)',flexWrap:'wrap',gap:12,marginTop:'auto'}}>
                  <div>
                    <span style={{fontSize:11,color:'#9a9da8',display:'block'}}>Starting from</span>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:'#c9a84c'}}>{formatPrice(h.price)}<small style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'#9a9da8',marginLeft:2}}>/night</small></span>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <Link to={`/hotel/${h._id}`} className="btn btn-outline btn-sm">View</Link>
                    <button className="btn btn-dark btn-sm" onClick={()=>handleDelete(h._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@media(max-width:640px){div[style*="grid-template-columns: 200px"]{grid-template-columns:1fr!important}}`}</style>
    </OwnerLayout>
  )
}
