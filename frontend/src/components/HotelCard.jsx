import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function HotelCard({ hotel }) {
  const { getImageUrl, formatPrice } = useApp()
  return (
    <div className="card group cursor-pointer">
      <Link to={`/hotel/${hotel._id}`} style={{textDecoration:'none',color:'inherit',display:'block'}}>
        <div style={{position:'relative',height:220,overflow:'hidden'}}>
          <img src={getImageUrl(hotel.image)} alt={hotel.hotelName}
            style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.6s ease'}}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
          />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(8,9,13,0.8) 0%,transparent 50%)'}}/>
          <div style={{position:'absolute',top:14,right:14}}>
            <span className="badge badge-gold">★ {hotel.rating?.toFixed(1)}</span>
          </div>
          <div style={{position:'absolute',bottom:12,left:12}}>
            <span style={{fontSize:12,color:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',gap:4}}>
              <img src="/assets/location_icon.png" alt="" style={{width:14,height:14,filter:'invert(1) opacity(0.7)'}}/>{hotel.city||hotel.hotelAddress?.split(',')[0]}
            </span>
          </div>
        </div>
        <div style={{padding:20}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:'#fff',marginBottom:8,lineHeight:1.3}}>{hotel.hotelName}</h3>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
            {hotel.amenities?.slice(0,4).map(a=>(
              <span key={a} style={{fontSize:11,padding:'3px 10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,color:'#9a9da8'}}>{a}</span>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:14,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
            <div>
              <span style={{fontSize:11,color:'#9a9da8',display:'block'}}>from</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:'#c9a84c'}}>{formatPrice(hotel.price)}</span>
              <span style={{fontSize:12,color:'#9a9da8',marginLeft:2}}>/night</span>
            </div>
            <span className="btn btn-gold btn-sm">View →</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
