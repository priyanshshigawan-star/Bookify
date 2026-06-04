import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{position:'relative',background:'#0e1120',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'80px 0 32px',marginTop:80,overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:600,height:1,background:'linear-gradient(90deg,transparent,#c9a84c,transparent)'}}/>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:60,marginBottom:60}}>
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
              <img src="/assets/bookify-logo.svg" alt="Bookify" style={{height:40,width:'auto',maxWidth:180,display:'block',objectFit:'contain'}} onError={e=>e.currentTarget.style.display='none'}/>
            </div>
            <p style={{color:'#9a9da8',fontSize:14,lineHeight:1.8}}>Where luxury meets comfort. Discover the world's finest hotels, curated for the discerning traveller.</p>
            <div style={{display:'flex',gap:10,marginTop:24}}>
              {['𝕏','in','f','▶'].map(s=>(
                <a key={s} href="#" style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#9a9da8',fontSize:13,textDecoration:'none',transition:'all 0.3s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#c9a84c';e.currentTarget.style.color='#c9a84c'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.color='#9a9da8'}}
                >{s}</a>
              ))}
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:32}}>
            {[
              {h:'Explore',links:[['Hotels','/hotels'],['All Rooms','/rooms'],['Top Rated','/hotels?sort=rating']]},
              {h:'Account',links:[['Sign Up','/signup'],['Login','/login'],['My Bookings','/my-bookings'],['Profile','/profile']]},
              {h:'For Owners',links:[['List Hotel','/signup'],['Dashboard','/owner/dashboard'],['Add Hotel','/owner/add-hotel']]},
              {h:'Support',links:[['Help Center','#'],['Privacy Policy','#'],['Terms','#'],['Contact','#']]},
            ].map(col=>(
              <div key={col.h}>
                <h4 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:'#fff',marginBottom:20,fontWeight:600}}>{col.h}</h4>
                {col.links.map(([label,to])=>(
                  <Link key={label} to={to} style={{display:'block',fontSize:14,color:'#9a9da8',marginBottom:12,textDecoration:'none',transition:'color 0.2s'}}
                    onMouseEnter={e=>e.currentTarget.style.color='#c9a84c'}
                    onMouseLeave={e=>e.currentTarget.style.color='#9a9da8'}
                  >{label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:28,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <p style={{fontSize:13,color:'#9a9da8'}}>© {new Date().getFullYear()} Bookify — Premium Hotel Booking Experience</p>
          <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
            {['🔒 Secure Booking','✦ Best Price Guarantee','◈ 24/7 Support'].map(b=>(
              <span key={b} style={{fontSize:12,color:'#9a9da8'}}>{b}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){footer .grid-footer{grid-template-columns:1fr!important}footer .grid-links{grid-template-columns:1fr 1fr!important}}`}</style>
    </footer>
  )
}
