import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import OwnerLayout from './OwnerLayout'

const AMENITIES = ['Free WiFi','Swimming Pool','Spa','Gym','Restaurant','Bar','Parking','Airport Shuttle','Room Service','Concierge','Business Center','Pet Friendly','Laundry','Air Conditioning','Sea View','Mountain View']

export default function AddHotel() {
  const [form, setForm] = useState({hotelName:'',hotelAddress:'',city:'',rating:'',price:'',description:'',phone:''})
  const [amenities, setAmenities] = useState([])
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.hotelName.trim()) e.hotelName='Hotel name is required'
    if (!form.hotelAddress.trim()) e.hotelAddress='Address is required'
    if (!form.rating||form.rating<1||form.rating>5) e.rating='Rating must be 1–5'
    if (!form.price||form.price<=0) e.price='Price must be greater than 0'
    if (!image) e.image='Hotel image is required'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) { toast.error('Please fix the errors'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v])=>v&&fd.append(k,v))
      fd.append('amenities',amenities.join(','))
      fd.append('image',image)
      const { data } = await api.post('/hotel/register',fd,{headers:{'Content-Type':'multipart/form-data'}})
      if(data.success){ toast.success('Hotel registered!'); navigate('/owner/hotels') }
    } catch (err) { toast.error(err.response?.data?.message||'Failed to register') }
    finally { setLoading(false) }
  }

  const toggle = a => setAmenities(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a])
  const S = {
    section: {background:'#161929',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:28,marginBottom:20,display:'flex',flexDirection:'column',gap:18},
    title: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,paddingBottom:16,borderBottom:'1px solid rgba(255,255,255,0.08)',marginBottom:2},
    grid2: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:16},
    amenBtn: (a) => ({padding:'7px 16px',background:amenities.includes(a)?'rgba(201,168,76,0.12)':'#1e2235',border:`1px solid ${amenities.includes(a)?'#c9a84c':'rgba(255,255,255,0.08)'}`,borderRadius:20,fontSize:13,color:amenities.includes(a)?'#c9a84c':'rgba(255,255,255,0.6)',cursor:'pointer',transition:'all 0.2s',fontFamily:"'DM Sans',sans-serif"}),
  }

  return (
    <OwnerLayout title="Add New Hotel" subtitle="List your property on Bookify">
      <form onSubmit={handleSubmit} noValidate style={{maxWidth:860}}>
        {/* Image Upload */}
        <div style={S.section}>
          <h3 style={S.title}>Hotel Image</h3>
          <label style={{display:'block',cursor:'pointer',border:`2px dashed ${errors.image?'#c94c4c':'rgba(255,255,255,0.1)'}`,borderRadius:12,overflow:'hidden',transition:'border-color 0.3s'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor='#c9a84c'}
            onMouseLeave={e=>e.currentTarget.style.borderColor=errors.image?'#c94c4c':'rgba(255,255,255,0.1)'}
          >
            <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setImage(f);setPreview(URL.createObjectURL(f))}}} style={{display:'none'}}/>
            {preview ? <img src={preview} alt="Preview" style={{width:'100%',height:240,objectFit:'cover',display:'block'}}/>
            : <div style={{padding:'60px 20px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <span style={{fontSize:40}}>🖼</span>
                <p style={{fontSize:15,color:'#fff',fontWeight:500}}>Click to upload hotel image</p>
                <span style={{fontSize:12,color:'#9a9da8'}}>JPG, PNG, WEBP · Max 5MB</span>
              </div>
            }
          </label>
          {errors.image&&<span className="form-error">{errors.image}</span>}
        </div>

        {/* Basic Info */}
        <div style={S.section}>
          <h3 style={S.title}>Basic Information</h3>
          <div style={S.grid2}>
            <div className="form-group">
              <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Hotel Name *</label>
              <input placeholder="e.g. The Grand Oberoi" value={form.hotelName} onChange={e=>setForm(p=>({...p,hotelName:e.target.value}))} style={errors.hotelName?{borderColor:'#c94c4c'}:{}}/>
              {errors.hotelName&&<span className="form-error">{errors.hotelName}</span>}
            </div>
            <div className="form-group">
              <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>City</label>
              <input placeholder="e.g. Mumbai" value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))}/>
            </div>
          </div>
          <div className="form-group">
            <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Full Address *</label>
            <input placeholder="Street address, area, landmark" value={form.hotelAddress} onChange={e=>setForm(p=>({...p,hotelAddress:e.target.value}))} style={errors.hotelAddress?{borderColor:'#c94c4c'}:{}}/>
            {errors.hotelAddress&&<span className="form-error">{errors.hotelAddress}</span>}
          </div>
          <div style={S.grid2}>
            <div className="form-group">
              <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Star Rating (1–5) *</label>
              <input type="number" min="1" max="5" step="0.1" placeholder="e.g. 4.5" value={form.rating} onChange={e=>setForm(p=>({...p,rating:e.target.value}))} style={errors.rating?{borderColor:'#c94c4c'}:{}}/>
              {errors.rating&&<span className="form-error">{errors.rating}</span>}
            </div>
            <div className="form-group">
              <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Starting Price / Night *</label>
              <input type="number" min="1" placeholder="e.g. 150" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} style={errors.price?{borderColor:'#c94c4c'}:{}}/>
              {errors.price&&<span className="form-error">{errors.price}</span>}
            </div>
          </div>
          <div className="form-group">
            <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Phone Number</label>
            <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
          </div>
          <div className="form-group">
            <label style={{fontSize:11,color:'#9a9da8',textTransform:'uppercase',letterSpacing:'0.5px'}}>Description</label>
            <textarea rows={4} placeholder="Describe your hotel…" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} style={{resize:'vertical'}}/>
          </div>
        </div>

        {/* Amenities */}
        <div style={S.section}>
          <h3 style={S.title}>Amenities</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {AMENITIES.map(a=><button key={a} type="button" onClick={()=>toggle(a)} style={S.amenBtn(a)}>{amenities.includes(a)?'✓ ':''}{a}</button>)}
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:12}}>
          <button type="button" className="btn btn-outline" onClick={()=>navigate('/owner/hotels')}>Cancel</button>
          <button type="submit" className="btn btn-gold btn-lg" disabled={loading}>{loading?'Registering…':'✦ Register Hotel'}</button>
        </div>
      </form>
      <style>{`@media(max-width:640px){div[style*="1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </OwnerLayout>
  )
}
