import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const { login, authLoading } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email) e.email='Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Invalid email'
    if (!form.password) e.password='Password is required'
    else if (form.password.length<6) e.password='Min. 6 characters'
    setErrors(e)
    return !Object.keys(e).length
  }
  const handleChange = e => { setForm(p=>({...p,[e.target.name]:e.target.value})); if(errors[e.target.name]) setErrors(p=>({...p,[e.target.name]:''})) }
  const handleSubmit = async e => { e.preventDefault(); if(!validate()) return; const r=await login(form); if(r?.success) navigate(r.role==='owner'?'/owner/dashboard':'/') }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'100px 24px 60px',position:'relative',background:'#08090d'}}>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none'}}/>
      <div style={{position:'fixed',top:-200,left:'50%',transform:'translateX(-50%)',width:700,height:500,background:'radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%)',pointerEvents:'none'}}/>

      <div className="animate-fade-up" style={{position:'relative',background:'#161929',border:'1px solid rgba(201,168,76,0.15)',borderRadius:24,padding:'48px 40px',width:'100%',maxWidth:460,boxShadow:'0 24px 80px rgba(0,0,0,0.5)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:28}}>
          <img src="/assets/bookify-logo.svg" alt="Bookify" style={{height:64,width:'auto',maxWidth:240,display:'block',objectFit:'contain'}} onError={e=>e.currentTarget.style.display='none'}/>
        </div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,textAlign:'center',marginBottom:8}}>Welcome Back</h1>
        <p style={{fontSize:14,color:'#9a9da8',textAlign:'center',marginBottom:28}}>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} noValidate style={{display:'flex',flexDirection:'column',gap:18}}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} style={errors.email?{borderColor:'#c94c4c'}:{}} autoComplete="email"/>
            {errors.email&&<span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{position:'relative'}}>
              <input type={showPass?'text':'password'} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} style={{...(errors.password?{borderColor:'#c94c4c'}:{}),paddingRight:44}} autoComplete="current-password"/>
              <button type="button" onClick={()=>setShowPass(p=>!p)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#9a9da8',fontSize:16,cursor:'pointer'}}>{showPass?'◎':'◉'}</button>
            </div>
            {errors.password&&<span className="form-error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={authLoading}>
            {authLoading?<span className="spinner spinner-sm"/>:'✦ Sign In'}
          </button>
        </form>

        <p style={{textAlign:'center',fontSize:14,color:'#9a9da8',marginTop:20}}>
          Don't have an account? <Link to="/signup" style={{color:'#c9a84c',fontWeight:500}}>Create one free →</Link>
        </p>
      </div>
    </div>
  )
}
