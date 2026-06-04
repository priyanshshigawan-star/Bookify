import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HotelCard from '../components/HotelCard'

const CITIES = ['All','Mumbai','Delhi','Goa','Jaipur','Bangalore','Chennai','Udaipur','Dubai','London','Paris']
const SORT_OPTIONS = [{value:'createdAt',label:'Newest First'},{value:'price_asc',label:'Price: Low to High'},{value:'price_desc',label:'Price: High to Low'},{value:'rating',label:'Top Rated'}]

export default function Hotels() {
  const { fetchHotels, hotels, hotelsLoading } = useApp()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search')||'')
  const [city, setCity] = useState(searchParams.get('city')||'All')
  const [sort, setSort] = useState('createdAt')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const p = {}
    if (search) p.search=search
    if (city!=='All') p.city=city
    if (sort) p.sort=sort
    if (minPrice) p.minPrice=minPrice
    if (maxPrice) p.maxPrice=maxPrice
    if (minRating) p.rating=minRating
    fetchHotels(p)
  }, [city, sort, minPrice, maxPrice, minRating])

  const handleSearch = e => { e.preventDefault(); const p={}; if(search)p.search=search; if(city!=='All')p.city=city; fetchHotels(p) }
  const clearAll = () => { setSearch('');setCity('All');setSort('createdAt');setMinPrice('');setMaxPrice('');setMinRating('');fetchHotels({}) }

  const S = {
    filterBtn: (a) => ({width:'100%',textAlign:'left',background:a?'rgba(201,168,76,0.12)':'none',border:`1px solid ${a?'#c9a84c':'transparent'}`,borderRadius:8,padding:'8px 12px',fontSize:14,color:a?'#c9a84c':'rgba(255,255,255,0.6)',cursor:'pointer',transition:'all 0.2s',marginBottom:4,fontFamily:"'DM Sans',sans-serif"}),
    pill: (a) => ({padding:'6px 18px',borderRadius:20,background:a?'rgba(201,168,76,0.12)':'rgba(255,255,255,0.04)',border:`1px solid ${a?'#c9a84c':'rgba(255,255,255,0.08)'}`,color:a?'#c9a84c':'rgba(255,255,255,0.6)',fontSize:13,cursor:'pointer',transition:'all 0.2s',fontFamily:"'DM Sans',sans-serif"}),
  }

  return (
    <div style={{paddingTop:80,minHeight:'100vh',background:'#08090d'}}>
      <div style={{background:'linear-gradient(135deg,#0e1120 0%,#161929 100%)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'60px 0 40px'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24,flexWrap:'wrap'}}>
          <div>
            <p style={{fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'#c9a84c',marginBottom:8}}>Discover</p>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,4vw,3rem)',fontWeight:600}}>All Hotels</h1>
            <p style={{color:'#9a9da8',fontSize:14,marginTop:6}}>{hotels.length} premium properties</p>
          </div>
          <form onSubmit={handleSearch} style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <input type="text" placeholder="Search hotels, cities…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:260,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}/>
            <button type="submit" className="btn btn-gold">Search</button>
          </form>
        </div>
      </div>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'40px 24px 80px'}}>
        {/* City pills */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:32}}>
          {CITIES.map(c=><button key={c} onClick={()=>setCity(c)} style={S.pill(city===c)}>{c}</button>)}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:32}}>
          {/* Sidebar */}
          <aside style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:24,height:'fit-content',position:'sticky',top:100}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20}}>Filters</h3>
              <button onClick={clearAll} style={{fontSize:12,color:'#9a9da8',background:'none',border:'none',cursor:'pointer',textDecoration:'underline',fontFamily:"'DM Sans',sans-serif"}}>Clear All</button>
            </div>
            <div style={{marginBottom:24,paddingBottom:24,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
              <p style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:12}}>City</p>
              {CITIES.map(c=><button key={c} onClick={()=>setCity(c)} style={S.filterBtn(city===c)}>{c}</button>)}
            </div>
            <div style={{marginBottom:24,paddingBottom:24,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
              <p style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:12}}>Price Range</p>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <input type="number" placeholder="Min $" value={minPrice} onChange={e=>setMinPrice(e.target.value)} style={{fontSize:13,padding:'8px 10px'}}/>
                <span style={{color:'#9a9da8',flexShrink:0}}>—</span>
                <input type="number" placeholder="Max $" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} style={{fontSize:13,padding:'8px 10px'}}/>
              </div>
            </div>
            <div>
              <p style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:12}}>Min Rating</p>
              {[1,2,3,4,5].map(r=>(
                <button key={r} onClick={()=>setMinRating(minRating==r?'':r)} style={{...S.filterBtn(minRating==r),color:'#c9a84c'}}>{'★'.repeat(r)}</button>
              ))}
            </div>
          </aside>

          {/* Grid */}
          <main>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <label style={{fontSize:13,color:'#9a9da8'}}>Sort by</label>
                <select value={sort} onChange={e=>setSort(e.target.value)} style={{width:'auto',padding:'8px 14px',fontSize:13,background:'#161929'}}>
                  {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            {hotelsLoading ? (
              <div className="page-loader"><div className="spinner"/><p>Loading hotels…</p></div>
            ) : hotels.length===0 ? (
              <div style={{textAlign:'center',padding:'80px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
                <span style={{fontSize:56}}>🏨</span>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:'#fff'}}>No Hotels Found</h3>
                <p style={{color:'#9a9da8'}}>Try adjusting your filters.</p>
                <button className="btn btn-gold" onClick={clearAll}>Clear Filters</button>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:24}}>
                {hotels.map((h,i)=>(
                  <div key={h._id} className="animate-fade-up" style={{animationDelay:`${i*60}ms`}}>
                    <HotelCard hotel={h}/>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <style>{`@media(max-width:900px){aside{display:none}}`}</style>
    </div>
  )
}
