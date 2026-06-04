import { useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../utils/api'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import OwnerLayout from './OwnerLayout'

const COLORS = ['#c9a84c','#4ec994','#e47a7a','#7aabe4','#b47ae4']
const Tip = ({ active, payload, label }) => active&&payload?.length ? (
  <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 14px',fontSize:13}}>
    <p style={{color:'#9a9da8',fontSize:12,marginBottom:4}}>{label}</p>
    {payload.map((p,i)=><p key={i} style={{color:p.color}}>{p.name}: ${Number(p.value).toLocaleString()}</p>)}
  </div>
) : null

const StatCard = ({ icon, label, value, sub, color='#c9a84c' }) => (
  <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:20,display:'flex',alignItems:'center',gap:16,transition:'all 0.3s'}}
    onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.15)';e.currentTarget.style.transform='translateY(-2px)'}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.transform='none'}}
  >
    <div style={{width:48,height:48,borderRadius:12,background:`${color}18`,color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{icon}</div>
    <div>
      <p style={{fontSize:12,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>{label}</p>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:'#fff',lineHeight:1}}>{value}</p>
      {sub&&<p style={{fontSize:11,color:'#6b6f7e',marginTop:4}}>{sub}</p>}
    </div>
  </div>
)

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { formatPrice } = useApp()
  const { user } = useAuth()

  useEffect(() => {
    api.get('/bookings/dashboard')
      .then(r=>{ if(r.data.success) setData(r.data) })
      .finally(()=>setLoading(false))
  }, [])

  if (loading) return <OwnerLayout title="Dashboard"><div className="page-loader"><div className="spinner"/></div></OwnerLayout>

  const { stats={}, monthlyRevenue=[], revenueByHotel=[], recentBookings=[] } = data||{}
  const pieData = [
    {name:'Confirmed',value:stats.confirmed||0},
    {name:'Pending',value:stats.pending||0},
    {name:'Cancelled',value:stats.cancelled||0},
  ]

  return (
    <OwnerLayout title={`Welcome back, ${user?.name?.split(' ')[0]} ✦`} subtitle="Here's your hotel performance overview">
      {/* Stat Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
        <StatCard icon="🏨" label="Total Hotels" value={stats.totalHotels||0} sub="Listed properties"/>
        <StatCard icon="🛏" label="Total Rooms" value={stats.totalRooms||0} sub="Across all hotels" color="#7aabe4"/>
        <StatCard icon="📋" label="Total Bookings" value={stats.totalBookings||0} sub={`${stats.confirmed||0} confirmed`} color="#4ec994"/>
        <StatCard icon="💰" label="Revenue" value={formatPrice(stats.totalRevenue||0)} sub="All time" />
        <StatCard icon="✅" label="Confirmed" value={stats.confirmed||0} sub="Active" color="#4ec994"/>
        <StatCard icon="⏳" label="Pending" value={stats.pending||0} sub="Awaiting" color="#c9874c"/>
        <StatCard icon="❌" label="Cancelled" value={stats.cancelled||0} sub="Refunded" color="#e47a7a"/>
        <StatCard icon="📈" label="Success Rate" value={stats.totalBookings?`${Math.round((stats.confirmed/stats.totalBookings)*100)}%`:'0%'} sub="Confirmation rate" color="#b47ae4"/>
      </div>

      {/* Charts Row */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20,marginBottom:28}}>
        <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:24}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600}}>Revenue Trend</h3>
            <span className="badge badge-gold">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="month" tick={{fill:'#6b6f7e',fontSize:12}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#6b6f7e',fontSize:12}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#c9a84c" strokeWidth={2} fill="url(#rg)" dot={{fill:'#c9a84c',r:4}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:24}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,marginBottom:20}}>Booking Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value"
                label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={{stroke:'rgba(255,255,255,0.15)'}}>
                {pieData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#161929',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Hotel */}
      {revenueByHotel.length>0&&(
        <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:24,marginBottom:28}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,marginBottom:20}}>Revenue by Hotel</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByHotel}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="hotel" tick={{fill:'#6b6f7e',fontSize:12}} axisLine={false}/>
              <YAxis tick={{fill:'#6b6f7e',fontSize:12}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <Tooltip contentStyle={{background:'#161929',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8}} formatter={v=>[`$${v}`,'Revenue']}/>
              <Bar dataKey="revenue" fill="#c9a84c" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Bookings */}
      <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:24}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600}}>Recent Bookings</h3>
          <a href="/owner/bookings" className="btn btn-outline btn-sm">View All</a>
        </div>
        {!recentBookings.length ? (
          <p style={{color:'#9a9da8',textAlign:'center',padding:40}}>No bookings yet.</p>
        ) : (
          <div style={{overflowX:'auto'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr 1fr 1fr 1fr',gap:12,padding:'10px 16px',background:'#1e2235',borderRadius:8,fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4,minWidth:600}}>
              {['Guest','Hotel · Room','Amount','Status','Date'].map(h=><span key={h}>{h}</span>)}
            </div>
            {recentBookings.map(b=>(
              <div key={b._id} style={{display:'grid',gridTemplateColumns:'1fr 2fr 1fr 1fr 1fr',gap:12,padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',fontSize:13,alignItems:'center',minWidth:600,transition:'background 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <span style={{fontWeight:500}}>{b.user?.name||'—'}</span>
                <span style={{color:'#9a9da8'}}>{b.hotel?.hotelName} · {b.room?.roomType}</span>
                <span style={{color:'#c9a84c',fontFamily:"'Cormorant Garamond',serif",fontSize:16}}>${b.totalPrice}</span>
                <span className={`badge ${b.status==='confirmed'?'badge-green':b.status==='pending'?'badge-yellow':'badge-red'}`}>{b.status}</span>
                <span style={{color:'#6b6f7e',fontSize:12}}>{new Date(b.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@media(max-width:1200px){div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:700px){div[style*="2fr 1fr"]{grid-template-columns:1fr!important}div[style*="repeat(4,1fr)"]{grid-template-columns:1fr!important}}`}</style>
    </OwnerLayout>
  )
}
