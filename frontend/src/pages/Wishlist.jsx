import { useEffect, useState } from 'react'
import api from '../utils/api'
import RoomCard from '../components/RoomCard'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try { const { data } = await api.get('/user/me'); if(data.success) setWishlist(data.user.wishlist||[]) }
      catch { toast.error('Failed to load wishlist') }
      finally { setLoading(false) }
    }; load()
  }, [])

  const handleRemove = async (roomId) => {
    try {
      await api.post(`/user/wishlist/${roomId}`)
      setWishlist(prev=>prev.filter(r=>(r._id||r)!==roomId))
      toast.success('Removed from wishlist')
    } catch { toast.error('Failed to update wishlist') }
  }

  return (
    <div style={{paddingTop:80,minHeight:'100vh',background:'#08090d'}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'60px 24px 80px'}}>
        <div style={{marginBottom:40}}>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,4vw,2.8rem)',fontWeight:600}}>My Wishlist ♡</h1>
          <p style={{color:'#9a9da8',fontSize:14,marginTop:6}}>{wishlist.length} saved room{wishlist.length!==1?'s':''}</p>
        </div>
        {loading ? <div className="page-loader"><div className="spinner"/></div>
        : wishlist.length===0 ? (
          <div style={{textAlign:'center',padding:'80px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
            <span style={{fontSize:64,color:'#6b6f7e',lineHeight:1}}>♡</span>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:'#fff'}}>Your wishlist is empty</h3>
            <p style={{color:'#9a9da8',maxWidth:360}}>Save rooms you love by clicking the heart icon on any room card.</p>
            <a href="/hotels" className="btn btn-gold">Explore Hotels</a>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:24}}>
            {wishlist.map(room=>typeof room==='object'?(
              <div key={room._id}>
                <RoomCard room={room}/>
                <button onClick={()=>handleRemove(room._id)} style={{width:'100%',marginTop:8,background:'rgba(201,76,76,0.1)',border:'1px solid rgba(201,76,76,0.2)',color:'#e47a7a',padding:'8px',borderRadius:8,fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",transition:'background 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(201,76,76,0.2)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(201,76,76,0.1)'}
                >✕ Remove</button>
              </div>
            ):null)}
          </div>
        )}
      </div>
    </div>
  )
}
