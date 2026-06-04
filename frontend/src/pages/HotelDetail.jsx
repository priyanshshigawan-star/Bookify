import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useApp } from '../context/AppContext'
import RoomCard from '../components/RoomCard'

export default function HotelDetail() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const { getImageUrl, formatPrice } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/hotel/${id}`)
        if (data.success) { setHotel(data.hotel); setRooms(data.rooms) }
      } catch { navigate('/hotels') }
      finally { setLoading(false) }
    }
    load(); window.scrollTo(0,0)
  }, [id])

  if (loading) return <div className="page-loader" style={{marginTop:80}}><div className="spinner"/></div>
  if (!hotel) return null

  return (
    <div style={{paddingTop:80,background:'#08090d',minHeight:'100vh'}}>
      {/* Hero */}
      <div style={{position:'relative',height:'55vh',minHeight:360,overflow:'hidden'}}>
        <img src={getImageUrl(hotel.image)} alt={hotel.hotelName} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(8,9,13,0.92) 0%,rgba(8,9,13,0.3) 60%,transparent 100%)'}}/>
        <div style={{position:'absolute',inset:0,maxWidth:1280,margin:'0 auto',padding:'0 24px',display:'flex',flexDirection:'column',justifyContent:'flex-end',paddingBottom:48}}>
          <Link to="/hotels" style={{color:'rgba(255,255,255,0.6)',fontSize:14,marginBottom:20,display:'inline-flex',alignItems:'center',gap:6,textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#c9a84c'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}>← All Hotels</Link>
          <div style={{color:'#c9a84c',fontSize:18,letterSpacing:2,marginBottom:8}}>{'★'.repeat(Math.round(hotel.rating))}</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:600,color:'#fff',marginBottom:10}}>{hotel.hotelName}</h1>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:15}}>📍 {hotel.hotelAddress}{hotel.city?`, ${hotel.city}`:''}</p>
        </div>
      </div>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'60px 24px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:40}}>
          {/* Main */}
          <div>
            <div style={{marginBottom:48,paddingBottom:48,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:'#fff',marginBottom:16}}>About This Hotel</h2>
              <p style={{color:'rgba(255,255,255,0.7)',lineHeight:1.9,fontSize:15}}>{hotel.description||'Experience world-class luxury and impeccable hospitality at this prestigious property.'}</p>
              {hotel.phone&&<p style={{color:'#9a9da8',marginTop:12,fontSize:14}}>📞 {hotel.phone}</p>}
            </div>
            {hotel.amenities?.length>0&&(
              <div style={{marginBottom:48,paddingBottom:48,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:'#fff',marginBottom:20}}>Amenities</h2>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10}}>
                  {hotel.amenities.map(a=><div key={a} style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'rgba(255,255,255,0.7)'}}><span style={{color:'#c9a84c',fontWeight:600}}>✓</span>{a}</div>)}
                </div>
              </div>
            )}
            <div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:'#fff',marginBottom:20}}>Available Rooms ({rooms.length})</h2>
              {rooms.length===0?<p style={{color:'#9a9da8'}}>No rooms available at this time.</p>:(
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
                  {rooms.map(r=><RoomCard key={r._id} room={{...r,hotel}} showHotel={false}/>)}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <div style={{background:'#161929',border:'1px solid rgba(201,168,76,0.2)',borderRadius:16,padding:28,position:'sticky',top:100}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',color:'#c9a84c',fontWeight:700}}>★ {hotel.rating?.toFixed(1)}</span>
                <span style={{fontSize:13,color:'#9a9da8'}}>Rating</span>
              </div>
              <div style={{height:1,background:'rgba(255,255,255,0.08)',margin:'16px 0'}}/>
              <p style={{fontSize:12,color:'#9a9da8',marginBottom:4}}>Starting from</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2rem',color:'#c9a84c',fontWeight:600}}>{formatPrice(hotel.price)}<small style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'#9a9da8',marginLeft:4}}>/night</small></p>
              <div style={{height:1,background:'rgba(255,255,255,0.08)',margin:'16px 0'}}/>
              {hotel.owner&&<><p style={{fontSize:12,color:'#9a9da8',marginBottom:4}}>Managed by</p><p style={{fontSize:14,color:'#fff',fontWeight:500,marginBottom:16}}>{hotel.owner.name}</p></>}
              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
                {[['📍',hotel.city||'Location'],hotel.phone&&['📞',hotel.phone],['✦','Bookify Verified']].filter(Boolean).map(([i,t])=><div key={t} style={{fontSize:14,color:'rgba(255,255,255,0.6)',display:'flex',gap:8}}><span>{i}</span>{t}</div>)}
              </div>
              {rooms.length>0&&<button className="btn btn-gold btn-full" onClick={()=>document.querySelector('#rooms')?.scrollIntoView({behavior:'smooth'})}>Choose Your Room →</button>}
            </div>
            <div style={{background:'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))',border:'1px solid rgba(201,168,76,0.2)',borderRadius:16,padding:24,textAlign:'center'}}>
              <div style={{fontSize:28,color:'#c9a84c',marginBottom:10}}>★</div>
              <h4 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:8}}>Earn Loyalty Points</h4>
              <p style={{fontSize:13,color:'#9a9da8',lineHeight:1.7,marginBottom:16}}>Earn 1 point for every $10 spent. Redeem for free nights.</p>
              <Link to="/signup" className="btn btn-outline btn-sm btn-full">Join Rewards</Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.hotel-layout{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
