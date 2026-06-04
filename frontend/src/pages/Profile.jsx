import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({ name:user?.name||'', phone:user?.phone||'' })
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  const avatarUrl = preview||(user?.avatar?`/images/${user.avatar}`:`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'U')}&background=c9a84c&color=08090d&bold=true&size=128`)
  const pts = user?.loyaltyPoints||0
  const tier = pts>=1000?{label:'🥇 Gold',color:'#c9a84c'}:pts>=500?{label:'🥈 Silver',color:'#9a9da8'}:{label:'🥉 Bronze',color:'#c87533'}

  const handleFile = e => { const f=e.target.files[0]; if(f){setAvatar(f);setPreview(URL.createObjectURL(f))} }
  const handleSave = async e => {
    e.preventDefault()
    if (!form.name.trim()||form.name.length<2) { toast.error('Name must be at least 2 characters'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name',form.name); fd.append('phone',form.phone)
      if (avatar) fd.append('avatar',avatar)
      const { data } = await api.put('/user/profile',fd,{headers:{'Content-Type':'multipart/form-data'}})
      if (data.success) { await refreshUser(); toast.success('Profile updated!') }
    } catch (err) { toast.error(err.response?.data?.message||'Update failed') }
    finally { setSaving(false) }
  }

  return (
    <div style={{paddingTop:80,minHeight:'100vh',background:'#08090d'}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'60px 24px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:32}}>
          {/* Left Panel */}
          <div style={{display:'flex',flexDirection:'column',gap:20}}>
            <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:32,textAlign:'center'}}>
              <div style={{position:'relative',width:100,margin:'0 auto 16px'}}>
                <img src={avatarUrl} alt="" style={{width:100,height:100,borderRadius:'50%',objectFit:'cover',border:'3px solid #c9a84c'}}/>
                <label style={{position:'absolute',bottom:0,right:0,width:30,height:30,background:'#c9a84c',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#08090d',fontSize:14,cursor:'pointer',fontWeight:700,transition:'transform 0.2s'}}
                  onMouseEnter={e=>e.currentTarget.style.transform='scale(1.1)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                >
                  <input type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>✎
                </label>
              </div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>{user?.name}</h2>
              <p style={{fontSize:13,color:'#9a9da8',marginBottom:12}}>{user?.email}</p>
              <span className={`badge ${user?.role==='owner'?'badge-gold':'badge-blue'}`}>{user?.role==='owner'?'✦ Hotel Owner':'◈ Guest'}</span>
            </div>

            {/* Loyalty */}
            <div style={{background:'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.03))',border:'1px solid rgba(201,168,76,0.2)',borderRadius:16,padding:24,textAlign:'center'}}>
              <p style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:1,marginBottom:12}}>★ Loyalty Points</p>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'3rem',fontWeight:700,color:'#c9a84c',lineHeight:1}}>{pts}</div>
              <p style={{fontSize:12,color:'#9a9da8',marginTop:4,marginBottom:12}}>points earned from bookings</p>
              <div style={{fontSize:14,fontWeight:500,color:tier.color}}>{tier.label}</div>
              <div style={{marginTop:16,height:6,background:'rgba(255,255,255,0.08)',borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${Math.min(100,(pts/1000)*100)}%`,background:'linear-gradient(90deg,#c9a84c,#a07830)',borderRadius:3,transition:'width 0.6s ease'}}/>
              </div>
              <p style={{fontSize:11,color:'#9a9da8',marginTop:6}}>{Math.max(0,1000-pts)} pts to Gold</p>
            </div>

            <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:20,display:'flex',alignItems:'center'}}>
              {[{v:pts,l:'Points'},{v:Math.floor(pts/100),l:'Free Nights'}].map((s,i)=>(
                <div key={s.l} style={{flex:1,textAlign:'center',...(i===0?{borderRight:'1px solid rgba(255,255,255,0.08)'}:{})}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:'#c9a84c'}}>{s.v}</div>
                  <div style={{fontSize:12,color:'#9a9da8'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{display:'flex',flexDirection:'column',gap:24}}>
            <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:28}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:20,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>Edit Profile</h3>
              <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:18}}>
                {[{label:'Full Name',name:'name',type:'text',ph:'Your full name'},{label:'Phone Number',name:'phone',type:'tel',ph:'+91 98765 43210'}].map(f=>(
                  <div key={f.name} className="form-group">
                    <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} value={form[f.name]} onChange={e=>setForm(p=>({...p,[f.name]:e.target.value}))}/>
                  </div>
                ))}
                <div className="form-group">
                  <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Email Address</label>
                  <input type="email" value={user?.email} disabled style={{opacity:0.5,cursor:'not-allowed'}}/>
                  <span style={{fontSize:11,color:'#9a9da8'}}>Email cannot be changed</span>
                </div>
                <button type="submit" className="btn btn-gold" style={{alignSelf:'flex-start'}} disabled={saving}>
                  {saving?'Saving…':'✓ Save Changes'}
                </button>
              </form>
            </div>
            <div style={{background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:28}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:20,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>Account Info</h3>
              {[
                ['Member Since', new Date(user?.createdAt||Date.now()).toLocaleDateString('en-IN',{month:'long',year:'numeric'})],
                ['Account Status', '✅ Active'],
                ['Role', user?.role==='owner'?'Hotel Owner':'Guest'],
                ['Wishlist Items', `${user?.wishlist?.length||0} rooms saved`],
              ].map(([l,v])=>(
                <div key={l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.06)',fontSize:14}}>
                  <span style={{color:'#9a9da8'}}>{l}</span><strong style={{color:'#fff'}}>{v}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){div[style*="grid-template-columns: 300px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
