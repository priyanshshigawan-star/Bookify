import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isOwner } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [pathname])
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleLogout = async () => { await logout(); navigate('/') }
  const avatar = user?.avatar ? `/images/${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=c9a84c&color=08090d&bold=true`

  const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path))

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:1000,
      transition:'all 0.4s ease',
      padding: scrolled?'12px 0':'20px 0',
      background: scrolled?'rgba(8,9,13,0.96)':'transparent',
      backdropFilter: scrolled?'blur(20px)':'none',
      borderBottom: scrolled?'1px solid rgba(201,168,76,0.12)':'none',
      boxShadow: scrolled?'0 4px 30px rgba(0,0,0,0.3)':'none',
    }}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:32}}>
        {/* Logo */}
        <Link to="/" style={{display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',flexShrink:0}}>
          <img src="/assets/bookify-logo.svg" alt="Bookify" style={{height:40,width:'auto',maxWidth:180,display:'block',objectFit:'contain'}} onError={e=>e.currentTarget.style.display='none'}/>
        </Link>

        {/* Desktop Links */}
        <div style={{display:'flex',gap:32,alignItems:'center'}} className="hidden-mobile">
          {[['/', 'Home'],['/hotels','Hotels'],['/rooms','Rooms'],['/about','About']].map(([to,label])=>(
            <Link key={to} to={to} style={{fontSize:14,color:isActive(to)?'#fff':'rgba(255,255,255,0.6)',transition:'color 0.3s',position:'relative',textDecoration:'none'}}>
              {label}
              <span style={{position:'absolute',bottom:-4,left:0,height:1,width:isActive(to)?'100%':0,background:'#c9a84c',transition:'width 0.3s'}}/>
            </Link>
          ))}
          {user&&!isOwner&&<Link to="/my-bookings" style={{fontSize:14,color:isActive('/my-bookings')?'#fff':'rgba(255,255,255,0.6)',transition:'color 0.3s',textDecoration:'none'}}>My Bookings</Link>}
          {user&&!isOwner&&<Link to="/wishlist" style={{fontSize:14,color:isActive('/wishlist')?'#fff':'rgba(255,255,255,0.6)',transition:'color 0.3s',textDecoration:'none'}}>Wishlist</Link>}
          {isOwner&&<Link to="/owner/dashboard" style={{fontSize:14,color:'rgba(255,255,255,0.6)',transition:'color 0.3s',textDecoration:'none'}}>Dashboard</Link>}
        </div>

        {/* Actions */}
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {!user?(
            <>
              <Link to="/login" className="btn btn-outline btn-sm" style={{display:'none'}} id="loginBtnDesktop">Login</Link>
              <Link to="/login" className="btn btn-outline btn-sm hidden-mobile-show">Login</Link>
              <Link to="/signup" className="btn btn-gold btn-sm">Join Now</Link>
            </>
          ):(
            <div style={{position:'relative'}} ref={dropRef}>
              <button onClick={()=>setDropOpen(p=>!p)} style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:40,padding:'6px 14px 6px 6px',color:'#fff',transition:'all 0.3s',cursor:'pointer'}}>
                <img src={avatar} alt="" style={{width:32,height:32,borderRadius:'50%',objectFit:'cover',border:'1.5px solid #c9a84c'}}/>
                <span style={{fontSize:14,fontWeight:500}} className="hidden-mobile-show">{user.name.split(' ')[0]}</span>
                <span style={{fontSize:10,color:'#9a9da8',transform:dropOpen?'rotate(180deg)':'none',transition:'transform 0.3s'}}>▾</span>
              </button>
              {dropOpen&&(
                <div style={{position:'absolute',right:0,top:'calc(100% + 12px)',width:260,background:'#161929',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,overflow:'hidden',boxShadow:'0 16px 48px rgba(0,0,0,0.5)',animation:'slideIn 0.2s ease'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,padding:20,background:'linear-gradient(135deg,rgba(201,168,76,0.08),transparent)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <img src={avatar} alt="" style={{width:44,height:44,borderRadius:'50%',border:'2px solid #c9a84c',objectFit:'cover'}}/>
                    <div>
                      <p style={{fontWeight:600,fontSize:14,marginBottom:2}}>{user.name}</p>
                      <p style={{fontSize:11,color:'#9a9da8',marginBottom:6}}>{user.email}</p>
                      <span className={isOwner?'badge badge-gold':'badge badge-blue'}>{isOwner?'✦ Owner':'◈ Guest'}</span>
                    </div>
                  </div>
                  <div style={{padding:'8px 0'}}>
                    {[
                      {to:'/profile',l:'⊙ My Profile'},
                      ...(!isOwner?[{to:'/my-bookings',l:'⊞ My Bookings'},{to:'/wishlist',l:'♡ Wishlist'}]:[]),
                      ...(isOwner?[{to:'/owner/dashboard',l:'⊟ Dashboard'},{to:'/owner/hotels',l:'🏨 My Hotels'},{to:'/owner/bookings',l:'⊞ Bookings'}]:[]),
                    ].map(({to,l})=>(
                      <Link key={to} to={to} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 20px',fontSize:14,color:'rgba(255,255,255,0.65)',transition:'all 0.2s',textDecoration:'none'}}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.08)';e.currentTarget.style.color='#fff'}}
                        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,0.65)'}}
                      >{l}</Link>
                    ))}
                  </div>
                  <button onClick={handleLogout} style={{width:'100%',textAlign:'left',padding:'14px 20px',fontSize:14,color:'#e47a7a',background:'rgba(201,76,76,0.06)',borderTop:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',border:'none',fontFamily:'DM Sans,sans-serif'}}>✕ Sign Out</button>
                </div>
              )}
            </div>
          )}
          <button onClick={()=>setMenuOpen(p=>!p)} className="hamburger-btn" style={{display:'none',flexDirection:'column',gap:5,background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:8,cursor:'pointer'}}>
            <span style={{display:'block',width:20,height:1.5,background:'#fff',transition:'all 0.3s',transform:menuOpen?'translateY(6.5px) rotate(45deg)':'none'}}/>
            <span style={{display:'block',width:20,height:1.5,background:'#fff',transition:'all 0.3s',opacity:menuOpen?0:1}}/>
            <span style={{display:'block',width:20,height:1.5,background:'#fff',transition:'all 0.3s',transform:menuOpen?'translateY(-6.5px) rotate(-45deg)':'none'}}/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={{overflow:'hidden',maxHeight:menuOpen?600:0,transition:'max-height 0.4s ease',background:'rgba(8,9,13,0.98)',backdropFilter:'blur(20px)'}} className="mobile-menu">
        <div style={{padding:'16px 24px 24px',display:'flex',flexDirection:'column',gap:4}}>
          {[['/', 'Home'],['/hotels','Hotels'],['/rooms','Rooms'],['/about','About']].map(([to,label])=>(
            <Link key={to} to={to} style={{display:'block',padding:'12px 0',fontSize:16,color:'rgba(255,255,255,0.7)',borderBottom:'1px solid rgba(255,255,255,0.06)',textDecoration:'none'}}>{label}</Link>
          ))}
          {user&&!isOwner&&<Link to="/my-bookings" style={{display:'block',padding:'12px 0',fontSize:16,color:'rgba(255,255,255,0.7)',borderBottom:'1px solid rgba(255,255,255,0.06)',textDecoration:'none'}}>My Bookings</Link>}
          {isOwner&&<Link to="/owner/dashboard" style={{display:'block',padding:'12px 0',fontSize:16,color:'rgba(255,255,255,0.7)',textDecoration:'none'}}>Dashboard</Link>}
          {!user?(
            <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>
              <Link to="/login" className="btn btn-outline btn-full">Login</Link>
              <Link to="/signup" className="btn btn-gold btn-full">Join Now</Link>
            </div>
          ):(
            <button onClick={handleLogout} style={{marginTop:8,textAlign:'left',padding:'12px 0',fontSize:14,color:'#e47a7a',background:'none',border:'none',cursor:'pointer'}}>✕ Sign Out</button>
          )}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.hidden-mobile{display:none!important}.hamburger-btn{display:flex!important}.hidden-mobile-show{display:none!important}}
        @media(min-width:901px){.mobile-menu{display:none!important}}
      `}</style>
    </nav>
  )
}
