import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function RoomCard({ room, showHotel=true }) {
  const { getImageUrl, formatPrice } = useApp()
  const { user } = useAuth()
  const img = room.images?.[0]

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to save rooms'); return }
    try {
      const { data } = await api.post(`/user/wishlist/${room._id}`)
      toast.success(data.message)
    } catch { toast.error('Failed to update wishlist') }
  }

  return (
    <div className="card group">
      <Link to={`/room/${room._id}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
        <div style={{position:'relative',height:200,overflow:'hidden'}}>
          <img src={getImageUrl(img)} alt={room.roomType}
            style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s ease'}}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
          />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(8,9,13,0.6) 0%,transparent 60%)'}}/>
          <button onClick={handleWishlist} style={{position:'absolute',top:12,right:12,background:'rgba(8,9,13,0.6)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'50%',width:36,height:36,fontSize:16,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s',cursor:'pointer'}}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.2)';e.currentTarget.style.borderColor='#c9a84c';e.currentTarget.style.color='#c9a84c'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(8,9,13,0.6)';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)';e.currentTarget.style.color='#fff'}}
          >♡</button>
          {!room.isAvailable&&<div style={{position:'absolute',bottom:12,left:12,background:'rgba(201,76,76,0.85)',color:'#fff',padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:500}}>Unavailable</div>}
        </div>
        <div style={{padding:18}}>
          {showHotel&&room.hotel&&<p style={{fontSize:12,color:'#9a9da8',marginBottom:6}}>🏨 {room.hotel.hotelName}</p>}
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:'#fff',marginBottom:10}}>{room.roomType}</h3>
          <div style={{display:'flex',gap:14,flexWrap:'wrap',marginBottom:12}}>
            {room.maxGuests&&<span style={{fontSize:12,color:'#9a9da8'}}>
              <img src="/assets/users_icon.png" alt="" style={{width:12,height:12,display:'inline',marginRight:4,filter:'invert(1) opacity(0.5)'}}/>
              {room.maxGuests} Guests
            </span>}
            {room.beds&&<span style={{fontSize:12,color:'#9a9da8'}}>
              <img src="/assets/bed_icon.png" alt="" style={{width:12,height:12,display:'inline',marginRight:4,filter:'invert(1) opacity(0.5)'}}/>
              {room.beds} Bed{room.beds>1?'s':''}
            </span>}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:14,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            <div>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:'#c9a84c'}}>{formatPrice(room.pricePerNight)}</span>
              <span style={{fontSize:12,color:'#9a9da8',marginLeft:2}}>/night</span>
            </div>
            <span className="btn btn-gold btn-sm">Book Now →</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
