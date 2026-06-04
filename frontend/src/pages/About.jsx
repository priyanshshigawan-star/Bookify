import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const TEAM = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', avatar: 'https://i.pravatar.cc/120?img=11', bio: 'Visionary hotelier with 15+ years in luxury hospitality.' },
  { name: 'Priya Sharma', role: 'Head of Design', avatar: 'https://i.pravatar.cc/120?img=47', bio: 'Award-winning designer crafting world-class digital experiences.' },
  { name: 'Rohan Verma', role: 'CTO', avatar: 'https://i.pravatar.cc/120?img=15', bio: 'Tech architect behind Bookify\'s seamless booking platform.' },
  { name: 'Sneha Kapoor', role: 'Customer Success', avatar: 'https://i.pravatar.cc/120?img=32', bio: 'Dedicated to ensuring every guest has a perfect stay.' },
]

const STATS = [
  { value: '500+', label: 'Premium Hotels', icon: '🏨' },
  { value: '50K+', label: 'Happy Guests', icon: '👥' },
  { value: '120+', label: 'Cities Covered', icon: '📍' },
  { value: '4.9★', label: 'Average Rating', icon: '⭐' },
]

const VALUES = [
  { icon: '✦', title: 'Excellence', desc: 'We curate only the finest properties, ensuring every hotel meets our strict luxury standards before listing.' },
  { icon: '◈', title: 'Transparency', desc: 'No hidden fees, no surprises. What you see is exactly what you get — honest pricing, always.' },
  { icon: '♡', title: 'Guest First', desc: 'Every decision we make starts with one question: does this make our guest\'s experience better?' },
  { icon: '⊞', title: 'Innovation', desc: 'From real-time availability to loyalty rewards, we constantly innovate to make booking effortless.' },
]

const MILESTONES = [
  { year: '2020', title: 'Bookify Founded', desc: 'Started with just 10 partner hotels in Mumbai with a dream to redefine luxury booking.' },
  { year: '2021', title: 'Pan-India Launch', desc: 'Expanded to 20 major Indian cities with over 100 premium hotel partners.' },
  { year: '2022', title: '10,000 Guests', desc: 'Celebrated our 10,000th booking milestone and launched the Loyalty Rewards program.' },
  { year: '2023', title: 'Global Expansion', desc: 'Entered international markets with hotels in Dubai, London, and Paris.' },
  { year: '2024', title: '50K+ Happy Guests', desc: 'Now serving guests across 120+ cities with 500+ handpicked luxury properties.' },
]

export default function About() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100); window.scrollTo(0, 0) }, [])

  const S = {
    section: { padding: '100px 0' },
    container: { maxWidth: 1280, margin: '0 auto', padding: '0 24px' },
    card: { background: '#161929', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 32, transition: 'all 0.3s' },
    eyebrow: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 12 },
    heading: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 600, color: '#fff' },
    muted: { color: '#9a9da8', lineHeight: 1.9, fontSize: 15 },
  }

  return (
    <div style={{ background: '#08090d', minHeight: '100vh', paddingTop: 80 }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '100px 0 80px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0e1120 0%,#08090d 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 800, height: 600, background: 'radial-gradient(circle,rgba(201,168,76,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ ...S.container, position: 'relative', zIndex: 2, textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ width: 40, height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c)', display: 'block' }} />
            <span style={S.eyebrow}>Our Story</span>
            <span style={{ width: 40, height: 1, background: 'linear-gradient(90deg,#c9a84c,transparent)', display: 'block' }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(3rem,7vw,5.5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: 24 }}>
            We Believe Every<br />
            <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#e4c97e,#a07830)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stay is a Story</em>
          </h1>
          <p style={{ ...S.muted, maxWidth: 600, margin: '0 auto 40px' }}>
            Bookify was born from a simple idea — that finding and booking a luxury hotel should feel as premium as the stay itself. We connect discerning travellers with extraordinary properties across the globe.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/hotels" className="btn btn-gold btn-lg">Explore Hotels</Link>
            <a href="#mission" className="btn btn-outline btn-lg">Our Mission ↓</a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg,rgba(201,168,76,0.05),transparent)' }}>
        <div style={{ ...S.container, padding: '60px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="animate-fade-up" style={{ textAlign: 'center', padding: '24px 16px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', animationDelay: `${i * 100}ms` }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.8rem', fontWeight: 700, color: '#c9a84c', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#9a9da8', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section id="mission" style={S.section}>
        <div style={S.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div className="animate-fade-up">
              <p style={S.eyebrow}>Our Mission</p>
              <h2 style={{ ...S.heading, marginBottom: 24 }}>Redefining the Way the World Books Hotels</h2>
              <p style={{ ...S.muted, marginBottom: 20 }}>
                At Bookify, our mission is to make luxury travel accessible, transparent, and effortless. We handpick every hotel on our platform, ensuring that when you book with us, you're guaranteed an experience that exceeds expectations.
              </p>
              <p style={{ ...S.muted, marginBottom: 32 }}>
                We believe that great hospitality shouldn't be complicated to find. That's why we've built a platform that puts the guest experience first — from discovery to check-out.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Every hotel personally verified by our team', 'Real-time availability & instant confirmation', 'Best price guarantee on all bookings', 'Dedicated 24/7 concierge support'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#c9a84c', flexShrink: 0 }}>✓</div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="animate-fade-up">
              {['/assets/popular_img1.png', '/assets/popular_img2.png', '/assets/popular_img3.png', '/assets/popular_img4.png'].map((src, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', height: i % 2 === 0 ? 180 : 140, transform: i === 1 ? 'translateY(20px)' : i === 2 ? 'translateY(-20px)' : 'none' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ ...S.section, background: '#0e1120' }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={S.eyebrow}>What We Stand For</p>
            <h2 style={S.heading}>Our Core Values</h2>
            <p style={{ ...S.muted, maxWidth: 540, margin: '16px auto 0' }}>These principles guide every decision we make — from the hotels we list to the support we offer.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
            {VALUES.map((v, i) => (
              <div key={v.title} className="animate-fade-up" style={{ ...S.card, animationDelay: `${i * 100}ms`, cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#c9a84c', marginBottom: 20 }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ ...S.muted, fontSize: 14 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={S.eyebrow}>Our Journey</p>
            <h2 style={S.heading}>How We Got Here</h2>
          </div>
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom,transparent,#c9a84c,transparent)', transform: 'translateX(-50%)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 0, animationDelay: `${i * 120}ms` }}>
                  <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left', padding: i % 2 === 0 ? '0 40px 0 0' : '0 0 0 40px', order: i % 2 === 0 ? 0 : 2 }}>
                    {i % 2 === 0 && (
                      <div style={{ ...S.card, display: 'inline-block', textAlign: 'left', maxWidth: 300 }}>
                        <span style={{ fontSize: 11, color: '#c9a84c', letterSpacing: 2, display: 'block', marginBottom: 8 }}>{m.year}</span>
                        <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{m.title}</h4>
                        <p style={{ fontSize: 13, color: '#9a9da8', lineHeight: 1.7 }}>{m.desc}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, zIndex: 1, boxShadow: '0 0 20px rgba(201,168,76,0.4)', order: 1 }}>✦</div>
                  <div style={{ flex: 1, padding: i % 2 !== 0 ? '0 40px 0 0' : '0 0 0 40px', order: i % 2 === 0 ? 2 : 0 }}>
                    {i % 2 !== 0 && (
                      <div style={{ ...S.card, maxWidth: 300 }}>
                        <span style={{ fontSize: 11, color: '#c9a84c', letterSpacing: 2, display: 'block', marginBottom: 8 }}>{m.year}</span>
                        <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{m.title}</h4>
                        <p style={{ fontSize: 13, color: '#9a9da8', lineHeight: 1.7 }}>{m.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ ...S.section, background: '#0e1120' }}>
        <div style={S.container}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={S.eyebrow}>The People Behind Bookify</p>
            <h2 style={S.heading}>Meet Our Team</h2>
            <p style={{ ...S.muted, maxWidth: 480, margin: '16px auto 0' }}>A passionate group of hospitality and tech experts dedicated to making your travel extraordinary.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 24 }}>
            {TEAM.map((t, i) => (
              <div key={t.name} className="animate-fade-up" style={{ ...S.card, textAlign: 'center', animationDelay: `${i * 100}ms` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.transform = 'translateY(-6px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none' }}
              >
                <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 16px' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #c9a84c' }} />
                  <div style={{ position: 'absolute', bottom: 2, right: 2, width: 18, height: 18, background: '#4ec994', borderRadius: '50%', border: '2px solid #161929' }} />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{t.name}</h3>
                <p style={{ fontSize: 12, color: '#c9a84c', letterSpacing: 1, marginBottom: 12 }}>{t.role}</p>
                <p style={{ fontSize: 13, color: '#9a9da8', lineHeight: 1.7 }}>{t.bio}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
                  {['in', '𝕏'].map(s => (
                    <a key={s} href="#" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#9a9da8', textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#9a9da8' }}
                    >{s}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <p style={S.eyebrow}>Get In Touch</p>
              <h2 style={{ ...S.heading, marginBottom: 20 }}>We'd Love to Hear From You</h2>
              <p style={{ ...S.muted, marginBottom: 32 }}>Whether you're a hotel owner looking to list your property, a traveller with a question, or just want to say hello — our team is here for you.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '📧', label: 'Email', value: 'support@bookify.com' },
                  { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                  { icon: '📍', label: 'Office', value: 'Mumbai, Maharashtra, India' },
                  { icon: '🕐', label: 'Support Hours', value: '24/7 for all guests' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', background: '#161929', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.background = 'rgba(201,168,76,0.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = '#161929' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <p style={{ fontSize: 11, color: '#9a9da8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{c.label}</p>
                      <p style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#161929', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 20, padding: 36 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Send Us a Message</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[{ label: 'Your Name', type: 'text', ph: 'John Doe' }, { label: 'Email Address', type: 'email', ph: 'you@email.com' }, { label: 'Subject', type: 'text', ph: 'How can we help?' }].map(f => (
                  <div key={f.label} className="form-group">
                    <label style={{ fontSize: 11, color: '#9a9da8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} />
                  </div>
                ))}
                <div className="form-group">
                  <label style={{ fontSize: 11, color: '#9a9da8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message</label>
                  <textarea rows={4} placeholder="Tell us more…" style={{ resize: 'vertical' }} />
                </div>
                <button className="btn btn-gold btn-full" style={{ marginTop: 4 }}>✦ Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', background: '#0e1120' }}>
        <div style={S.container}>
          <div style={{ position: 'relative', background: 'linear-gradient(135deg,#161929,#1e2235)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 24, padding: '70px 40px', textAlign: 'center', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <p style={{ ...S.eyebrow, textAlign: 'center', marginBottom: 16 }}>Ready to Experience Bookify?</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 600, marginBottom: 16 }}>Start Your Luxury Journey Today</h2>
            <p style={{ ...S.muted, maxWidth: 480, margin: '0 auto 40px' }}>Join 50,000+ guests who trust Bookify for their travel. Sign up free and discover extraordinary stays.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-gold btn-lg">Create Free Account</Link>
              <Link to="/hotels" className="btn btn-outline btn-lg">Browse Hotels</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important;gap:40px!important}
          div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr)!important}
          div[style*="position: absolute; left: 50%"]{display:none!important}
          div[style*="flex: 1; text-align: right"]{flex:1!important;text-align:left!important;padding:0 0 0 20px!important}
        }
        @media(max-width:600px){
          div[style*="repeat(4,1fr)"]{grid-template-columns:1fr 1fr!important}
        }
      `}</style>
    </div>
  )
}
