import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HotelCard from '../components/HotelCard'
import RoomCard from '../components/RoomCard'

const CITIES = ['All','Mumbai','Delhi','Goa','Jaipur','Bangalore','Chennai','Udaipur','Dubai','London','Paris']
const TESTIMONIALS = [
  { name:'Priya S.',role:'Business Traveller',text:'Bookify made my Mumbai trip seamless. The premium room selection is unmatched — found my dream suite in minutes.',avatar:'https://i.pravatar.cc/80?img=47',rating:5},
  { name:'Aryan M.',role:'Frequent Traveller',text:'I have used many platforms but Bookify stands apart. The luxury curation and instant confirmation is incredible.',avatar:'https://i.pravatar.cc/80?img=12',rating:5},
  { name:'Sneha R.',role:'Honeymoon Couple',text:'Our honeymoon suite was exactly as shown — the special request feature was a wonderful touch. Highly recommend!',avatar:'https://i.pravatar.cc/80?img=32',rating:5},
]
const FEATURES = [
  {icon:'/assets/wifi_icon.png',title:'Curated Luxury',desc:'Handpicked premium hotels, verified for quality and excellence.'},
  {icon:'/assets/bed_icon.png',title:'Instant Confirmation',desc:'Book in seconds with real-time availability and immediate confirmation.'},
  {icon:'/assets/dining_icon.png',title:'Best Price Guarantee',desc:'We match any lower price — your luxury at the best value, always.'},
  {icon:'/assets/bath_icon.png',title:'Loyalty Rewards',desc:'Earn points on every booking and redeem for exclusive upgrades.'},
  {icon:'/assets/tv_icon.png',title:'Flexible Cancellation',desc:'Plans change. Cancel up to 24 hours before check-in at no cost.'},
  {icon:'/assets/freezer_icon.png',title:'24/7 Concierge',desc:'Our dedicated support team is always available for you.'},
]

export default function Home() {
  const { fetchHotels, fetchRooms, hotels, rooms, hotelsLoading } = useApp()
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('All')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [loaded, setLoaded] = useState(false)
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchHotels()
    fetchRooms()
    setTimeout(()=>setLoaded(true), 100)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (city !== 'All') p.set('city', city)
    navigate(`/hotels?${p}`)
  }

  return (
    <div style={{background:'#08090d'}}>
      {/* ── HERO with hero_img.png ── */}
      <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden'}}>
        {/* Background image */}
        <div style={{position:'absolute',inset:0}}>
          <img src="/assets/hero_img.png" alt="Hero" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/>
          {/* Overlays */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(8,9,13,0.85) 0%,rgba(8,9,13,0.5) 60%,rgba(8,9,13,0.75) 100%)'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(8,9,13,1) 0%,transparent 40%)'}}/>
          {/* Animated grid overlay */}
          <div className="hero-grid-bg" style={{position:'absolute',inset:0,opacity:0.5}}/>
        </div>

        {/* Floating particles */}
        <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
          {Array.from({length:12}).map((_,i)=>(
            <div key={i} style={{position:'absolute',bottom:'-10%',left:`${8+i*7.5}%`,width:1,height:50,background:'linear-gradient(to top,transparent,#c9a84c)',opacity:0,animation:`particleRise ${6+i*0.5}s ease ${i*0.6}s infinite`}}/>
          ))}
        </div>

        {/* Content */}
        <div style={{position:'relative',zIndex:2,width:'100%',maxWidth:1280,margin:'0 auto',padding:'120px 24px 80px',opacity:loaded?1:0,transform:loaded?'translateY(0)':'translateY(30px)',transition:'all 0.9s ease'}}>
          {/* Eyebrow */}
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24,justifyContent:'flex-start'}}>
            <span style={{flex:'0 0 40px',height:1,background:'linear-gradient(90deg,transparent,#c9a84c)'}}/>
            <span style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c'}}>Premium Hotel Experience</span>
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(3rem,8vw,6rem)',fontWeight:600,lineHeight:1.1,color:'#fff',marginBottom:24,maxWidth:720}}>
            Discover Your<br/>
            <em style={{fontStyle:'italic',background:'linear-gradient(135deg,#e4c97e,#a07830)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Perfect</em> Stay
          </h1>
          <p style={{fontSize:'clamp(14px,2vw,18px)',color:'rgba(255,255,255,0.65)',maxWidth:500,marginBottom:48,lineHeight:1.9}}>
            From boutique escapes to grand palatial suites — find and book the world's most extraordinary hotels.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{display:'flex',alignItems:'stretch',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(201,168,76,0.25)',backdropFilter:'blur(20px)',borderRadius:20,padding:'8px 8px 8px 0',maxWidth:860,gap:0,overflow:'hidden',transition:'all 0.3s'}}>
            <div style={{flex:1,padding:'12px 20px',display:'flex',flexDirection:'column',gap:4,minWidth:0}}>
              <label style={{fontSize:10,letterSpacing:1.5,color:'#c9a84c',textTransform:'uppercase'}}>Destination</label>
              <input type="text" placeholder="Hotel or city name…" value={search} onChange={e=>setSearch(e.target.value)} style={{background:'transparent',border:'none',padding:0,color:'#fff',fontSize:14,borderRadius:0,width:'100%',boxShadow:'none'}}/>
            </div>
            <div style={{width:1,background:'rgba(255,255,255,0.1)',margin:'12px 0'}}/>
            <div style={{flex:'0 0 160px',padding:'12px 20px',display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontSize:10,letterSpacing:1.5,color:'#c9a84c',textTransform:'uppercase'}}>City</label>
              <select value={city} onChange={e=>setCity(e.target.value)} style={{background:'transparent',border:'none',padding:0,color:'#fff',fontSize:14,borderRadius:0,boxShadow:'none',cursor:'pointer'}}>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{width:1,background:'rgba(255,255,255,0.1)',margin:'12px 0'}}/>
            <div style={{flex:'0 0 140px',padding:'12px 20px',display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontSize:10,letterSpacing:1.5,color:'#c9a84c',textTransform:'uppercase'}}>Check In</label>
              <input type="date" value={checkIn} min={today} onChange={e=>setCheckIn(e.target.value)} style={{background:'transparent',border:'none',padding:0,color:'#fff',fontSize:13,borderRadius:0,boxShadow:'none'}}/>
            </div>
            <div style={{width:1,background:'rgba(255,255,255,0.1)',margin:'12px 0'}}/>
            <div style={{flex:'0 0 140px',padding:'12px 20px',display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontSize:10,letterSpacing:1.5,color:'#c9a84c',textTransform:'uppercase'}}>Check Out</label>
              <input type="date" value={checkOut} min={checkIn||today} onChange={e=>setCheckOut(e.target.value)} style={{background:'transparent',border:'none',padding:0,color:'#fff',fontSize:13,borderRadius:0,boxShadow:'none'}}/>
            </div>
            <button type="submit" className="btn btn-gold" style={{borderRadius:14,padding:'14px 28px',margin:0,flexShrink:0}}>🔍 Search</button>
          </form>

          {/* Quick tags */}
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:24}}>
            {['Goa Beaches','Delhi Palace','Mumbai Luxury','Jaipur Heritage'].map(tag=>(
              <button key={tag} onClick={()=>navigate(`/hotels?search=${tag.split(' ')[0]}`)} style={{padding:'8px 20px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:20,color:'rgba(255,255,255,0.65)',fontSize:13,cursor:'pointer',transition:'all 0.3s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#c9a84c';e.currentTarget.style.color='#c9a84c'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.color='rgba(255,255,255,0.65)'}}
              >{tag}</button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{position:'absolute',bottom:40,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:8,color:'rgba(255,255,255,0.3)',fontSize:11,letterSpacing:2,textTransform:'uppercase',animation:'float 2.5s ease-in-out infinite'}}>
          <div style={{width:22,height:36,border:'1.5px solid rgba(255,255,255,0.2)',borderRadius:11,display:'flex',justifyContent:'center',paddingTop:6}}>
            <div style={{width:3,height:8,background:'#c9a84c',borderRadius:2,animation:'wheelScroll 2s ease infinite'}}/>
          </div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{padding:'60px 0',background:'linear-gradient(135deg,rgba(201,168,76,0.05),transparent)',borderTop:'1px solid rgba(255,255,255,0.06)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0}}>
          {[
            {v:'500+',l:'Premium Hotels',icon:'/assets/dashboard_icon.png'},
            {v:'50K+',l:'Happy Guests',icon:'/assets/users_icon.png'},
            {v:'120+',l:'Cities Covered',icon:'/assets/location_icon.png'},
            {v:'4.9★',l:'Average Rating',icon:'/assets/camera_icon.png'},
          ].map((s,i)=>(
            <div key={s.l} className="animate-fade-up" style={{textAlign:'center',padding:'20px 16px',borderRight:i<3?'1px solid rgba(255,255,255,0.06)':'none',animationDelay:`${i*100}ms`}}>
              <img src={s.icon} alt="" style={{width:28,height:28,margin:'0 auto 12px',filter:'invert(1) sepia(1) saturate(2) hue-rotate(5deg)',opacity:0.7}}/>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.5rem',fontWeight:700,color:'#c9a84c',lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:13,color:'#9a9da8',marginTop:6}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED HOTELS ── */}
      <section style={{padding:'100px 0'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <p style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Handpicked For You</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,4vw,3rem)',fontWeight:600,color:'#fff'}}>Featured Hotels</h2>
            <p style={{color:'#9a9da8',maxWidth:540,margin:'16px auto 0',fontSize:15,lineHeight:1.8}}>Explore our most loved luxury properties, curated for an unforgettable experience.</p>
          </div>
          {hotelsLoading ? (
            <div className="page-loader"><div className="spinner"/><p>Loading hotels…</p></div>
          ) : hotels.length === 0 ? (
            <div style={{textAlign:'center',padding:'60px 20px',color:'#9a9da8',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
              <p style={{fontSize:18}}>🏨 No hotels yet. Be the first to list your property!</p>
              <Link to="/signup" className="btn btn-gold">List Your Hotel</Link>
            </div>
          ) : (
            <>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24}}>
                {hotels.slice(0,6).map((h,i)=>(
                  <div key={h._id} className="animate-fade-up" style={{animationDelay:`${i*80}ms`}}>
                    <HotelCard hotel={h}/>
                  </div>
                ))}
              </div>
              {hotels.length>6&&(
                <div style={{textAlign:'center',marginTop:40}}>
                  <Link to="/hotels" className="btn btn-outline btn-lg">View All Hotels →</Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── OFFER IMAGES STRIP ── */}
      <section style={{padding:'0 0 80px',overflow:'hidden'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',marginBottom:32}}>
          <p style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:8}}>Exclusive Offers</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.8rem,3vw,2.5rem)',fontWeight:600}}>Deals Just For You</h2>
        </div>
        <div style={{display:'flex',gap:16,paddingLeft:24,overflowX:'auto',paddingBottom:8,scrollbarWidth:'none'}}>
          {[1,2,3,4,5,6,7,8].map(n=>(
            <div key={n} style={{flex:'0 0 260px',borderRadius:16,overflow:'hidden',border:'1px solid rgba(255,255,255,0.08)',transition:'all 0.3s',cursor:'pointer'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}}
            >
              <img src={`/assets/offer_img${n}.png`} alt={`Offer ${n}`} style={{width:'100%',height:160,objectFit:'cover'}}/>
              <div style={{padding:'12px 16px',background:'#161929'}}>
                <p style={{fontSize:13,fontWeight:600,color:'#fff',marginBottom:4}}>Special Offer {n}</p>
                <p style={{fontSize:12,color:'#9a9da8'}}>Up to 30% off · Limited time</p>
                <span className="badge badge-gold" style={{marginTop:8}}>Save Now</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROOMS PREVIEW ── */}
      <section style={{padding:'100px 0',background:'#0e1120'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px'}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:60,flexWrap:'wrap',gap:16}}>
            <div>
              <p style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Finest Rooms</p>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,4vw,3rem)',fontWeight:600,color:'#fff'}}>Luxury Suites & Rooms</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline">View All Rooms →</Link>
          </div>
          {rooms.length === 0 ? (
            <div style={{textAlign:'center',color:'#9a9da8',padding:40}}>No rooms available yet.</div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24}}>
              {rooms.slice(0,6).map(r=><RoomCard key={r._id} room={r}/>)}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{padding:'100px 0'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <p style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Why Bookify</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,4vw,3rem)',fontWeight:600,color:'#fff'}}>The Bookify Difference</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:24}}>
            {FEATURES.map((f,i)=>(
              <div key={f.title} className="card animate-fade-up" style={{padding:32,animationDelay:`${i*80}ms`}}>
                <img src={f.icon} alt="" style={{width:32,height:32,marginBottom:16,filter:'invert(1) sepia(1) saturate(2) hue-rotate(5deg)',opacity:0.8}}/>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:'#fff',marginBottom:10}}>{f.title}</h3>
                <p style={{fontSize:14,color:'#9a9da8',lineHeight:1.8}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{padding:'80px 0',background:'#0e1120'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <p style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:12}}>Guest Stories</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,4vw,3rem)',fontWeight:600,color:'#fff'}}>What Our Guests Say</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:24}}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={t.name} className="card animate-fade-up" style={{padding:32,animationDelay:`${i*120}ms`}}>
                <div style={{color:'#c9a84c',fontSize:16,letterSpacing:2,marginBottom:16}}>{'★'.repeat(t.rating)}</div>
                <p style={{fontSize:15,color:'rgba(255,255,255,0.75)',lineHeight:1.9,fontStyle:'italic',marginBottom:24}}>"{t.text}"</p>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <img src={t.avatar} alt={t.name} style={{width:44,height:44,borderRadius:'50%',border:'2px solid #c9a84c'}}/>
                  <div>
                    <strong style={{display:'block',fontSize:14,color:'#fff'}}>{t.name}</strong>
                    <span style={{fontSize:12,color:'#9a9da8'}}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{padding:'100px 0'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px'}}>
          <div style={{position:'relative',background:'linear-gradient(135deg,#161929,#1e2235)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:24,padding:'80px 40px',textAlign:'center',overflow:'hidden'}}>
            <div style={{position:'absolute',top:-100,left:'50%',transform:'translateX(-50%)',width:500,height:300,background:'radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <p style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:16}}>Own a Hotel?</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,4vw,3rem)',fontWeight:600,color:'#fff',marginBottom:16}}>List Your Property on Bookify</h2>
            <p style={{color:'#9a9da8',maxWidth:480,margin:'0 auto 40px',lineHeight:1.8}}>Join 500+ premium hotels already on our platform. Reach thousands of discerning guests.</p>
            <div style={{display:'flex',justifyContent:'center',gap:16,flexWrap:'wrap'}}>
              <Link to="/signup" className="btn btn-gold btn-lg">Get Started Free</Link>
              <Link to="/hotels" className="btn btn-outline btn-lg">Browse Hotels</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
