import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [form, setForm] = useState({ name:'',email:'',password:'',role:'user',phone:'' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const { signup, authLoading } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.name.trim()||form.name.length<2) e.name='Name must be at least 2 characters'
    if (!form.email) e.email='Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Invalid email'
    if (!form.password||form.password.length<6) e.password='Min. 6 characters'
    setErrors(e); return !Object.keys(e).length
  }
  const handleChange = e => { setForm(p=>({...p,[e.target.name]:e.target.value})); if(errors[e.target.name]) setErrors(p=>({...p,[e.target.name]:''})) }
  const handleSubmit = async e => { e.preventDefault(); if(!validate()) return; const r=await signup(form); if(r?.success) navigate(r.role==='owner'?'/owner/dashboard':'/') }
  const strength = form.password.length>=12?'Strong':form.password.length>=8?'Medium':form.password.length>0?'Weak':''
  const strengthColor = strength==='Strong'?'#4ec994':strength==='Medium'?'#c9a84c':'#e47a7a'
  const strengthW = strength==='Strong'?'100%':strength==='Medium'?'66%':strength==='Weak'?'33%':'0%'

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'100px 24px 60px',position:'relative',background:'#08090d'}}>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none'}}/>

      <div className="animate-fade-up" style={{position:'relative',background:'#161929',border:'1px solid rgba(201,168,76,0.15)',borderRadius:24,padding:'48px 40px',width:'100%',maxWidth:480,boxShadow:'0 24px 80px rgba(0,0,0,0.5)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:28}}>
          <img src="/assets/bookify-logo.svg" alt="Bookify" style={{height:64,width:'auto',maxWidth:240,display:'block',objectFit:'contain'}} onError={e=>e.currentTarget.style.display='none'}/>
        </div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,textAlign:'center',marginBottom:8}}>Create Account</h1>
        <p style={{fontSize:14,color:'#9a9da8',textAlign:'center',marginBottom:24}}>Join thousands of happy travellers</p>

        {/* Role selector */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:24}}>
          {[{v:'user',l:'◈ Guest',d:'Book hotels'},{v:'owner',l:'✦ Owner',d:'List hotels'}].map(r=>(
            <button key={r.v} type="button" onClick={()=>setForm(p=>({...p,role:r.v}))} style={{background:form.role===r.v?'rgba(201,168,76,0.12)':'#1e2235',border:`1px solid ${form.role===r.v?'#c9a84c':'rgba(255,255,255,0.08)'}`,borderRadius:12,padding:'14px 12px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:4,transition:'all 0.3s'}}>
              <span style={{fontSize:14,fontWeight:600,color:form.role===r.v?'#c9a84c':'#fff'}}>{r.l}</span>
              <span style={{fontSize:11,color:'#9a9da8'}}>{r.d}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} style={errors.name?{borderColor:'#c94c4c'}:{}}/>
            {errors.name&&<span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} style={errors.email?{borderColor:'#c94c4c'}:{}} autoComplete="email"/>
            {errors.email&&<span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <input type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{position:'relative'}}>
              <input type={showPass?'text':'password'} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} style={{...(errors.password?{borderColor:'#c94c4c'}:{}),paddingRight:44}} autoComplete="new-password"/>
              <button type="button" onClick={()=>setShowPass(p=>!p)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#9a9da8',fontSize:16,cursor:'pointer'}}>{showPass?'◎':'◉'}</button>
            </div>
            {errors.password&&<span className="form-error">{errors.password}</span>}
            {form.password&&(
              <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6}}>
                <div style={{flex:1,height:3,background:'#1e2235',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:strengthW,background:strengthColor,borderRadius:2,transition:'all 0.3s'}}/></div>
                <span style={{fontSize:11,color:strengthColor,fontWeight:500}}>{strength}</span>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={authLoading}>
            {authLoading?<span className="spinner spinner-sm"/>:'✦ Create Account'}
          </button>
        </form>
        <p style={{textAlign:'center',fontSize:14,color:'#9a9da8',marginTop:20}}>
          Already have an account? <Link to="/login" style={{color:'#c9a84c',fontWeight:500}}>Sign in →</Link>
        </p>
        <p style={{textAlign:'center',fontSize:11,color:'#6b6f7e',marginTop:12,lineHeight:1.6}}>By signing up, you agree to our <a href="#" style={{color:'#9a9da8',textDecoration:'underline'}}>Terms</a> and <a href="#" style={{color:'#9a9da8',textDecoration:'underline'}}>Privacy Policy</a>.</p>
      </div>
    </div>
  )
}
