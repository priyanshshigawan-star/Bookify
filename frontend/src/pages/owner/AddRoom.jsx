import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import OwnerLayout from './OwnerLayout'

const AMENITIES = ['King Bed','Queen Bed','Twin Beds','Ocean View','Balcony','Bathtub','Rain Shower','Mini Bar','Smart TV','Air Conditioning','Safe','Sofa','Work Desk','Coffee Maker','Kitchenette','Jacuzzi']
const ROOM_TYPES = ['Deluxe Room','Superior Room','Suite','Junior Suite','Presidential Suite','Penthouse','Studio','Family Room','Executive Room','Ocean View Room']

export default function AddRoom() {
  const [hotels, setHotels] = useState([])
  const [form, setForm] = useState({hotel:'',roomType:'',pricePerNight:'',description:'',maxGuests:2,beds:1,size:'',isAvailable:true})
  const [amenities, setAmenities] = useState([])
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/hotel/owner/list').then(({data})=>{ if(data.success) setHotels(data.hotels) })
  }, [])

  const validate = () => {
    const e = {}
    if (!form.hotel) e.hotel='Please select a hotel'
    if (!form.roomType) e.roomType='Room type is required'
    if (!form.pricePerNight||form.pricePerNight<=0) e.pricePerNight='Price must be greater than 0'
    if (!form.description.trim()) e.description='Description is required'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) { toast.error('Please fix the errors'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v])=>fd.append(k,v))
      fd.append('amenities',amenities.join(','))
      images.forEach(img=>fd.append('images',img))
      const { data } = await api.post('/room/add',fd,{headers:{'Content-Type':'multipart/form-data'}})
      if(data.success){ toast.success('Room added!'); navigate('/owner/rooms') }
    } catch (err) { toast.error(err.response?.data?.message||'Failed to add room') }
    finally { setLoading(false) }
  }

  const toggle = a => setAmenities(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a])
  const S = {
    section: {background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:28,marginBottom:20,display:'flex',flexDirection:'column',gap:18},
    title: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.08)',marginBottom:2},
    grid2: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:16},
    grid3: {display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16},
    lbl: {fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'},
    amenBtn: (a) => ({padding:'7px 16px',background:amenities.includes(a)?'rgba(201,168,76,0.12)':'#1e2235',border:`1px solid ${amenities.includes(a)?'#c9a84c':'rgba(255,255,255,0.08)'}`,borderRadius:20,fontSize:13,color:amenities.includes(a)?'#c9a84c':'rgba(255,255,255,0.6)',cursor:'pointer',transition:'all 0.2s',fontFamily:"'DM Sans',sans-serif"}),
  }

  return (
    <OwnerLayout title="Add New Room" subtitle="Add a room to one of your hotels">
      <form onSubmit={handleSubmit} noValidate style={{maxWidth:860}}>
        {/* Images */}
        <div style={S.section}>
          <h3 style={S.title}>Room Images (up to 6)</h3>
          <label style={{display:'block',cursor:'pointer',border:'2px dashed rgba(255,255,255,0.1)',borderRadius:12,overflow:'hidden',transition:'border-color 0.3s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor='#c9a84c'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}
          >
            <input type="file" accept="image/*" multiple onChange={e=>{const f=Array.from(e.target.files).slice(0,6);setImages(f);setPreviews(f.map(x=>URL.createObjectURL(x)))}} style={{display:'none'}}/>
            {previews.length ? (
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,padding:12}}>
                {previews.map((p,i)=><img key={i} src={p} alt="" style={{width:'100%',height:120,objectFit:'cover',borderRadius:8}}/>)}
              </div>
            ) : (
              <div style={{padding:'60px 20px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <span style={{fontSize:40}}>🖼</span>
                <p style={{fontSize:15,color:'#fff',fontWeight:500}}>Click to upload room images</p>
                <span style={{fontSize:12,color:'#9a9da8'}}>Up to 6 images · Max 5MB each</span>
              </div>
            )}
          </label>
        </div>

        {/* Room Details */}
        <div style={S.section}>
          <h3 style={S.title}>Room Details</h3>
          <div className="form-group">
            <label style={S.lbl}>Select Hotel *</label>
            <select value={form.hotel} onChange={e=>setForm(p=>({...p,hotel:e.target.value}))} style={errors.hotel?{borderColor:'#c94c4c'}:{}}>
              <option value="">— Choose your hotel —</option>
              {hotels.map(h=><option key={h._id} value={h._id}>{h.hotelName}</option>)}
            </select>
            {errors.hotel&&<span className="form-error">{errors.hotel}</span>}
          </div>
          <div style={S.grid2}>
            <div className="form-group">
              <label style={S.lbl}>Room Type *</label>
              <select value={form.roomType} onChange={e=>setForm(p=>({...p,roomType:e.target.value}))} style={errors.roomType?{borderColor:'#c94c4c'}:{}}>
                <option value="">— Select type —</option>
                {ROOM_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
              {errors.roomType&&<span className="form-error">{errors.roomType}</span>}
            </div>
            <div className="form-group">
              <label style={S.lbl}>Price per Night ($) *</label>
              <input type="number" min="1" placeholder="e.g. 250" value={form.pricePerNight} onChange={e=>setForm(p=>({...p,pricePerNight:e.target.value}))} style={errors.pricePerNight?{borderColor:'#c94c4c'}:{}}/>
              {errors.pricePerNight&&<span className="form-error">{errors.pricePerNight}</span>}
            </div>
          </div>
          <div style={S.grid3}>
            <div className="form-group"><label style={S.lbl}>Max Guests</label><input type="number" min="1" max="10" value={form.maxGuests} onChange={e=>setForm(p=>({...p,maxGuests:e.target.value}))}/></div>
            <div className="form-group"><label style={S.lbl}>Number of Beds</label><input type="number" min="1" max="5" value={form.beds} onChange={e=>setForm(p=>({...p,beds:e.target.value}))}/></div>
            <div className="form-group"><label style={S.lbl}>Room Size</label><input placeholder="45 sqm" value={form.size} onChange={e=>setForm(p=>({...p,size:e.target.value}))}/></div>
          </div>
          <div className="form-group">
            <label style={S.lbl}>Description *</label>
            <textarea rows={4} placeholder="Describe the room experience, views, unique features…" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={{...errors.description?{borderColor:'#c94c4c'}:{},resize:'vertical'}}/>
            {errors.description&&<span className="form-error">{errors.description}</span>}
          </div>
          <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:14}}>
            <input type="checkbox" checked={form.isAvailable} onChange={e=>setForm(p=>({...p,isAvailable:e.target.checked}))} style={{width:'auto',accentColor:'#c9a84c'}}/>
            Room is available for booking
          </label>
        </div>

        {/* Amenities */}
        <div style={S.section}>
          <h3 style={S.title}>Room Amenities</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {AMENITIES.map(a=><button key={a} type="button" onClick={()=>toggle(a)} style={S.amenBtn(a)}>{amenities.includes(a)?'✓ ':''}{a}</button>)}
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:12}}>
          <button type="button" className="btn btn-outline" onClick={()=>navigate('/owner/rooms')}>Cancel</button>
          <button type="submit" className="btn btn-gold btn-lg" disabled={loading}>{loading?'Adding…':'✦ Add Room'}</button>
        </div>
      </form>
      <style>{`@media(max-width:640px){div[style*="1fr 1fr"]{grid-template-columns:1fr!important}div[style*="1fr 1fr 1fr"]{grid-template-columns:1fr 1fr!important}div[style*="repeat(3,1fr)"]{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </OwnerLayout>
  )
}
