import { Link, useLocation } from 'react-router-dom'

const NAV = [
  {to:'/owner/dashboard',icon:'/assets/dashboard_icon.png',label:'Dashboard'},
  {to:'/owner/hotels',icon:'/assets/room_icon.png',label:'My Hotels'},
  {to:'/owner/add-hotel',icon:'/assets/add_icon.png',label:'Add Hotel'},
  {to:'/owner/rooms',icon:'/assets/bed_icon.png',label:'Rooms'},
  {to:'/owner/add-room',icon:'/assets/add_icon.png',label:'Add Room'},
  {to:'/owner/bookings',icon:'/assets/users_icon.png',label:'Bookings'},
  {to:'/profile',icon:'/assets/profile_icon.png',label:'Profile'},
]

export default function OwnerLayout({ children, title, subtitle }) {
  const { pathname } = useLocation()
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#08090d'}}>
      {/* Sidebar */}
      <aside style={{width:240,background:'#0e1120',borderRight:'1px solid rgba(255,255,255,0.08)',position:'fixed',top:0,left:0,bottom:0,display:'flex',flexDirection:'column',zIndex:100,overflowY:'auto'}}>
        <div style={{padding:'28px 24px 8px',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <img src="/assets/bookify-logo.svg" alt="Bookify" style={{height:36,width:'auto',maxWidth:160,display:'block',objectFit:'contain'}} onError={e=>e.currentTarget.style.display='none'}/>
        </div>
        <p style={{fontSize:10,color:'#c9a84c',letterSpacing:2,textTransform:'uppercase',padding:'0 24px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>Owner Panel</p>
        <nav style={{padding:'12px 12px',flex:1,display:'flex',flexDirection:'column',gap:2}}>
          {NAV.map(n=>{
            const active = pathname===n.to
            return (
              <Link key={n.to} to={n.to} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 16px',borderRadius:10,fontSize:14,color:active?'#c9a84c':'rgba(255,255,255,0.55)',background:active?'rgba(201,168,76,0.12)':'transparent',textDecoration:'none',transition:'all 0.2s'}}
                onMouseEnter={e=>{if(!active){e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.color='#fff'}}}
                onMouseLeave={e=>{if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,0.55)'}}}
              >
                <img src={n.icon} alt="" style={{width:18,height:18,filter:active?'invert(1) sepia(1) saturate(2) hue-rotate(5deg) opacity(0.9)':'invert(1) opacity(0.4)'}}/>
                {n.label}
              </Link>
            )
          })}
        </nav>
        <Link to="/" style={{margin:'auto 16px 20px',fontSize:13,color:'#9a9da8',padding:'10px 12px',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,textAlign:'center',textDecoration:'none',transition:'all 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='#c9a84c';e.currentTarget.style.color='#c9a84c'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='#9a9da8'}}
        >← Back to Website</Link>
      </aside>

      {/* Main */}
      <main style={{marginLeft:240,flex:1,padding:40,minHeight:'100vh'}}>
        {(title||subtitle)&&(
          <div style={{marginBottom:32,paddingBottom:24,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            {title&&<h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.6rem,3vw,2.2rem)',fontWeight:600}}>{title}</h1>}
            {subtitle&&<p style={{color:'#9a9da8',fontSize:14,marginTop:6}}>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
      <style>{`@media(max-width:900px){aside{display:none!important}main{margin-left:0!important;padding:100px 20px 40px!important}}`}</style>
    </div>
  )
}
