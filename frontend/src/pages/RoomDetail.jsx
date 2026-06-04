import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RoomDetail() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [persons, setPersons] = useState(1)
  const [payMethod, setPayMethod] = useState('Pay At Hotel')
  const [specialReq, setSpecialReq] = useState('')
  const [avail, setAvail] = useState(null)
  const [bookLoading, setBookLoading] = useState(false)
  const [availLoading, setAvailLoading] = useState(false)
  const { getImageUrl, formatPrice, calcNights } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/room/${id}`)
        if (data.success) setRoom(data.room)
      } catch { navigate('/hotels') }
      finally { setLoading(false) }
    }
    load(); window.scrollTo(0,0)
  }, [id])

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) { toast.error('Select check-in and check-out dates'); return }
    setAvailLoading(true)
    try {
      const { data } = await api.post('/bookings/check-availability', { room: id, checkInDate: checkIn, checkOutDate: checkOut })
      setAvail(data.isAvailable)
      toast(data.isAvailable ? '✅ Room is available!' : '❌ Not available for these dates')
    } catch (err) { toast.error(err.response?.data?.message || 'Error checking availability') }
    finally { setAvailLoading(false) }
  }

  const handleBook = async () => {
    if (!user) { toast.error('Please login to book'); navigate('/login'); return }
    if (!checkIn || !checkOut) { toast.error('Please select dates'); return }
    if (avail === false) { toast.error('Room is not available for selected dates'); return }
    setBookLoading(true)
    try {
      const { data } = await api.post('/bookings/book', { room: id, checkInDate: checkIn, checkOutDate: checkOut, persons, paymentMethod: payMethod, specialRequests: specialReq })
      if (data.success) { toast.success(`Booking confirmed! +${data.loyaltyPointsEarned} loyalty points 🎉`); navigate('/my-bookings') }
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed') }
    finally { setBookLoading(false) }
  }

  const nights = calcNights(checkIn, checkOut)
  const totalPrice = room ? room.pricePerNight * nights : 0

  if (loading) return <div className="page-loader" style={{marginTop:80}}><div className="spinner"/></div>
  if (!room) return null

  return (
    <div style={{paddingTop:80,background:'#08090d',minHeight:'100vh'}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'40px 24px 80px'}}>
        {/* Breadcrumb */}
        <div style={{fontSize:13,color:'#9a9da8',marginBottom:28,display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
          <Link to="/hotels" style={{color:'#9a9da8',textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#c9a84c'} onMouseLeave={e=>e.currentTarget.style.color='#9a9da8'}>Hotels</Link>
          <span>/</span>
          {room.hotel&&<><Link to={`/hotel/${room.hotel._id}`} style={{color:'#9a9da8',textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>e.currentTarget.style.color='#c9a84c'} onMouseLeave={e=>e.currentTarget.style.color='#9a9da8'}>{room.hotel.hotelName}</Link><span>/</span></>}
          <span style={{color:'#fff'}}>{room.roomType}</span>
        </div>

        {/* Gallery */}
        <div style={{marginBottom:40}}>
          <div style={{borderRadius:16,overflow:'hidden',height:'50vh',minHeight:320}}>
            <img src={getImageUrl(room.images?.[activeImg])} alt={room.roomType} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          {room.images?.length>1&&(
            <div style={{display:'flex',gap:12,marginTop:12,overflowX:'auto'}}>
              {room.images.map((img,i)=>(
                <img key={i} src={getImageUrl(img)} alt={`View ${i+1}`} onClick={()=>setActiveImg(i)} style={{width:90,height:60,objectFit:'cover',borderRadius:8,cursor:'pointer',border:`2px solid ${activeImg===i?'#c9a84c':'transparent'}`,transition:'border-color 0.2s',flexShrink:0}}/>
              ))}
            </div>
          )}
        </div>

        {/* Layout */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:40}}>
          {/* Info */}
          <div>
            {room.hotel&&<p style={{fontSize:13,color:'#9a9da8',marginBottom:8}}>🏨 {room.hotel.hotelName}</p>}
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:600,marginBottom:16}}>{room.roomType}</h1>
            <div style={{display:'flex',gap:20,flexWrap:'wrap',marginBottom:24}}>
              {room.maxGuests&&<span style={{fontSize:14,color:'#9a9da8'}}>👥 Up to {room.maxGuests} guests</span>}
              {room.beds&&<span style={{fontSize:14,color:'#9a9da8'}}>🛏 {room.beds} bed{room.beds>1?'s':''}</span>}
              {room.size&&<span style={{fontSize:14,color:'#9a9da8'}}>⊡ {room.size}</span>}
            </div>
            <p style={{color:'rgba(255,255,255,0.7)',lineHeight:1.9,fontSize:15,marginBottom:32}}>{room.description}</p>
            {room.amenities?.length>0&&(
              <div style={{marginBottom:32}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:16}}>Room Amenities</h3>
                <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                  {room.amenities.map(a=><span key={a} style={{fontSize:14,color:'rgba(255,255,255,0.7)',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,padding:'6px 14px'}}>✓ {a}</span>)}
                </div>
              </div>
            )}
            {nights>0&&(
              <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:24}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,marginBottom:16}}>Price Breakdown</h3>
                {[
                  [formatPrice(room.pricePerNight)+` × ${nights} night${nights>1?'s':''}`, formatPrice(totalPrice)],
                  ['Taxes & fees', 'Included'],
                ].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)',fontSize:14}}>
                    <span style={{color:'#9a9da8'}}>{l}</span><span style={{color:v==='Included'?'#4ec994':'#fff'}}>{v}</span>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0',fontWeight:600,fontSize:16}}>
                  <span>Total</span><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:'#c9a84c'}}>{formatPrice(totalPrice)}</span>
                </div>
                <p style={{fontSize:12,color:'#c9a84c',marginTop:8,opacity:0.85}}>✦ You'll earn {Math.floor(totalPrice/10)} loyalty points</p>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div style={{background:'#161929',border:'1px solid rgba(201,168,76,0.2)',borderRadius:16,padding:28,position:'sticky',top:100,display:'flex',flexDirection:'column',gap:14,height:'fit-content'}}>
            <div style={{display:'flex',alignItems:'baseline',gap:6}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.2rem',color:'#c9a84c',fontWeight:700}}>{formatPrice(room.pricePerNight)}</span>
              <span style={{fontSize:14,color:'#9a9da8'}}>/night</span>
            </div>
            {!room.isAvailable&&<div style={{background:'rgba(201,76,76,0.1)',border:'1px solid rgba(201,76,76,0.3)',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#e47a7a'}}>⚠️ This room is currently unavailable.</div>}
            {[
              {label:'Check In',type:'date',val:checkIn,min:today,fn:v=>{setCheckIn(v);setAvail(null)}},
              {label:'Check Out',type:'date',val:checkOut,min:checkIn||today,fn:v=>{setCheckOut(v);setAvail(null)}},
            ].map(f=>(
              <div key={f.label} className="form-group">
                <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>{f.label}</label>
                <input type={f.type} value={f.val} min={f.min} onChange={e=>f.fn(e.target.value)}/>
              </div>
            ))}
            <div className="form-group">
              <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Guests</label>
              <select value={persons} onChange={e=>setPersons(e.target.value)}>
                {Array.from({length:room.maxGuests||4}).map((_,i)=><option key={i+1} value={i+1}>{i+1} Guest{i>0?'s':''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Payment</label>
              <select value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                <option>Pay At Hotel</option><option>Online</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Special Requests</label>
              <textarea rows={2} placeholder="Late check-in, dietary needs…" value={specialReq} onChange={e=>setSpecialReq(e.target.value)} style={{resize:'vertical',minHeight:60}}/>
            </div>
            {avail!==null&&(
              <div style={{background:avail?'rgba(78,201,148,0.1)':'rgba(201,76,76,0.1)',border:`1px solid ${avail?'rgba(78,201,148,0.3)':'rgba(201,76,76,0.3)'}`,borderRadius:8,padding:'10px 14px',fontSize:13,color:avail?'#4ec994':'#e47a7a'}}>
                {avail?'✅ Available for selected dates!':'❌ Not available — choose other dates.'}
              </div>
            )}
            {nights>0&&(
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                <span style={{fontSize:14,color:'#9a9da8'}}>Total ({nights} nights)</span>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:'#c9a84c',fontWeight:600}}>{formatPrice(totalPrice)}</span>
              </div>
            )}
            <button className="btn btn-outline btn-full" onClick={checkAvailability} disabled={availLoading}>{availLoading?'Checking…':'⊞ Check Availability'}</button>
            <button className="btn btn-gold btn-full" onClick={handleBook} disabled={bookLoading||!room.isAvailable}>{bookLoading?'Booking…':'✦ Book Now'}</button>
            {!user&&<p style={{textAlign:'center',fontSize:13,color:'#9a9da8'}}>Please <Link to="/login" style={{color:'#c9a84c'}}>login</Link> to book.</p>}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.room-layout{grid-template-columns:1fr!important}div[style*="position:sticky"]{position:static!important}}`}</style>
    </div>
  )
}
