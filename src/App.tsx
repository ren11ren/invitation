import { useState, useEffect, useRef, useCallback } from 'react'
import EMAIL_CONFIG from './emailConfig'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'rect' | 'circle' | 'star'
  opacity: number
  life: number
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#c8a8e9', '#f5b8d0', '#7c3aed', '#a855f7', '#fde8f0', '#e8d5f5', '#f5d0e8', '#b8d4f0', '#fbbf24', '#34d399']
const NAV_ITEMS = [
  { id: 'welcome', icon: '👑', label: 'Welcome' },
  { id: 'countdown', icon: '⏳', label: 'Countdown' },
  { id: 'details', icon: '✨', label: 'Details' },
  { id: 'story', icon: '📖', label: 'Story' },
  { id: 'gallery', icon: '🖼️', label: 'Gallery' },
  { id: 'location', icon: '📍', label: 'Location' },
  { id: 'rsvp', icon: '💌', label: 'RSVP' },
]

// ─── SVG: Crown ──────────────────────────────────────────────────────────────
function CrownSVG({ size = 80, color = '#f5d0e8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 100 70" fill="none">
      <path d="M5 60 L15 20 L30 40 L50 5 L70 40 L85 20 L95 60 Z" fill={color} stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="5" y="58" width="90" height="10" rx="5" fill={color} />
      <circle cx="50" cy="5" r="5" fill="#fbbf24" />
      <circle cx="15" cy="20" r="4" fill="#fbbf24" />
      <circle cx="85" cy="20" r="4" fill="#fbbf24" />
      <circle cx="30" cy="40" r="3" fill="#fbbf24" opacity="0.8" />
      <circle cx="70" cy="40" r="3" fill="#fbbf24" opacity="0.8" />
    </svg>
  )
}

// ─── SVG: Castle silhouette ───────────────────────────────────────────────────
function CastleSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 250" fill="none" className={className}>
      {/* left tower */}
      <rect x="20" y="110" width="90" height="140" fill="currentColor" />
      <rect x="10" y="88" width="22" height="30" fill="currentColor" />
      <rect x="44" y="88" width="22" height="30" fill="currentColor" />
      <rect x="78" y="88" width="22" height="30" fill="currentColor" />
      <ellipse cx="65" cy="150" rx="20" ry="28" fill="rgba(0,0,0,0.2)" />
      {/* centre tower */}
      <rect x="370" y="40" width="160" height="210" fill="currentColor" />
      <polygon points="370,40 450,0 530,40" fill="currentColor" />
      <rect x="358" y="20" width="24" height="30" fill="currentColor" />
      <rect x="414" y="20" width="24" height="30" fill="currentColor" />
      <rect x="506" y="20" width="24" height="30" fill="currentColor" />
      <ellipse cx="450" cy="130" rx="30" ry="42" fill="rgba(0,0,0,0.2)" />
      {/* right tower */}
      <rect x="790" y="110" width="90" height="140" fill="currentColor" />
      <rect x="780" y="88" width="22" height="30" fill="currentColor" />
      <rect x="814" y="88" width="22" height="30" fill="currentColor" />
      <rect x="848" y="88" width="22" height="30" fill="currentColor" />
      <ellipse cx="835" cy="150" rx="20" ry="28" fill="rgba(0,0,0,0.2)" />
      {/* side wings */}
      <rect x="200" y="140" width="80" height="110" fill="currentColor" />
      <rect x="620" y="140" width="80" height="110" fill="currentColor" />
      {/* connectors */}
      <rect x="110" y="160" width="90" height="90" fill="currentColor" />
      <rect x="700" y="160" width="90" height="90" fill="currentColor" />
      <rect x="280" y="120" width="90" height="130" fill="currentColor" />
      <rect x="530" y="120" width="90" height="130" fill="currentColor" />
    </svg>
  )
}

// ─── Butterfly ───────────────────────────────────────────────────────────────
function Butterfly({ x, y, delay, duration, size = 1 }: { x: string; y: string; delay: number; duration: number; size?: number }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, animation: `btfly ${duration}s ${delay}s ease-in-out infinite` }}
    >
      <svg width={32 * size} height={22 * size} viewBox="0 0 48 32" fill="none">
        <ellipse cx="13" cy="13" rx="13" ry="9" fill="rgba(200,168,233,0.65)" />
        <ellipse cx="35" cy="13" rx="13" ry="9" fill="rgba(245,184,208,0.65)" />
        <ellipse cx="13" cy="21" rx="8" ry="6" fill="rgba(168,130,210,0.45)" />
        <ellipse cx="35" cy="21" rx="8" ry="6" fill="rgba(232,160,195,0.45)" />
        <line x1="24" y1="3" x2="24" y2="29" stroke="#9b6fc8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 3 Q21 1 18 2" stroke="#9b6fc8" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M24 3 Q27 1 30 2" stroke="#9b6fc8" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// ─── Sparkle ─────────────────────────────────────────────────────────────────
function Sparkle({ x, y, delay, duration, size = 14, color = 'white' }: { x: string; y: string; delay: number; duration: number; size?: number; color?: string }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, animation: `sparkle ${duration}s ${delay}s ease-in-out infinite`, color }}
    >
      <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0L9.3 6.7L16 8L9.3 9.3L8 16L6.7 9.3L0 8L6.7 6.7Z" />
      </svg>
    </div>
  )
}

// ─── Countdown ───────────────────────────────────────────────────────────────
function Countdown() {
  const target = new Date('2026-08-29T12:00:00')
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 })
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  const units = [{ l: 'Days', v: t.d }, { l: 'Hours', v: t.h }, { l: 'Minutes', v: t.m }, { l: 'Seconds', v: t.s }]
  return (
    <div className="flex gap-3 md:gap-6 justify-center flex-wrap">
      {units.map(({ l, v }) => (
        <div key={l} className="flex flex-col items-center" style={{ minWidth: 80 }}>
          <div
            className="relative flex items-center justify-center rounded-2xl"
            style={{
              width: 80, height: 90,
              background: 'linear-gradient(160deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
            }}
          >
            <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '2.2rem', color: 'white', lineHeight: 1, textShadow: '0 0 20px rgba(200,168,233,0.8)' }}>
              {String(v).padStart(2, '0')}
            </span>
          </div>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', color: '#c8a8e9', marginTop: 6, textTransform: 'uppercase' }}>{l}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1628509633348-a39defbc44c4?w=600&h=600&fit=crop&auto=format', alt: 'Birthday cake with pink roses' },
  { url: 'https://images.unsplash.com/photo-1578237407404-cbe8d05e2300?w=600&h=600&fit=crop&auto=format', alt: 'Floral birthday cake' },
  { url: 'https://images.unsplash.com/photo-1747576660180-f3b789cb0f7a?w=600&h=600&fit=crop&auto=format', alt: 'Flower decorated birthday cake' },
  { url: 'https://images.unsplash.com/photo-1580964398985-6222571ccd32?w=600&h=600&fit=crop&auto=format', alt: 'Pink candles birthday cake' },
  { url: 'https://images.unsplash.com/photo-1528756514091-dee5ecaa3278?w=600&h=600&fit=crop&auto=format', alt: 'Lavender flowers' },
  { url: 'https://images.unsplash.com/photo-1477511801984-4ad318ed9846?w=600&h=600&fit=crop&auto=format', alt: 'Pink delicate flowers' },
]

function Gallery() {
  const [lb, setLb] = useState<null | typeof GALLERY[0]>(null)
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {GALLERY.map((img) => (
          <button
            key={img.url}
            onClick={() => setLb(img)}
            className="group relative overflow-hidden focus:outline-none"
            style={{ borderRadius: 20, aspectRatio: '1', background: '#e8d5f5' }}
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-90" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(124,58,237,0.3)' }}>
              <span style={{ fontSize: '1.8rem' }}>🔍</span>
            </div>
          </button>
        ))}
      </div>
      {lb && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(20,8,40,0.92)', backdropFilter: 'blur(12px)' }} onClick={() => setLb(null)}>
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lb.url.replace('w=600', 'w=900')} alt={lb.alt} className="w-full rounded-3xl shadow-2xl" />
            <button onClick={() => setLb(null)} className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#9b6fc8,#c840a0)' }}>✕</button>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiBurst({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  useEffect(() => {
    if (!active) return
    const ps: Particle[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 10 + 4),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      shape: (['rect', 'circle', 'star'] as const)[Math.floor(Math.random() * 3)],
      opacity: 1,
      life: 1,
    }))
    setParticles(ps)
    let frame: number
    const tick = () => {
      setParticles((prev) => {
        const next = prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.35,
          rotation: p.rotation + p.rotationSpeed,
          life: p.life - 0.012,
          opacity: Math.max(0, p.life - 0.012),
        })).filter((p) => p.life > 0)
        if (next.length > 0) frame = requestAnimationFrame(tick)
        return next
      })
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active])
  if (!particles.length) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      <svg className="w-full h-full">
        {particles.map((p) => {
          const cx = `${p.x}%`; const cy = `${p.y}%`
          const sz = p.size
          if (p.shape === 'circle') return <ellipse key={p.id} cx={cx} cy={cy} rx={sz} ry={sz * 0.6} fill={p.color} opacity={p.opacity} transform={`rotate(${p.rotation},${p.x * window.innerWidth / 100},${p.y * window.innerHeight / 100})`} />
          if (p.shape === 'star') return <polygon key={p.id} points={`${p.x * window.innerWidth / 100},${p.y * window.innerHeight / 100 - sz} ${p.x * window.innerWidth / 100 + sz * 0.4},${p.y * window.innerHeight / 100 + sz * 0.5} ${p.x * window.innerWidth / 100 - sz * 0.7},${p.y * window.innerHeight / 100 - sz * 0.2} ${p.x * window.innerWidth / 100 + sz * 0.7},${p.y * window.innerHeight / 100 - sz * 0.2} ${p.x * window.innerWidth / 100 - sz * 0.4},${p.y * window.innerHeight / 100 + sz * 0.5}`} fill={p.color} opacity={p.opacity} />
          return <rect key={p.id} x={`${p.x}%`} y={`${p.y}%`} width={sz} height={sz * 0.5} fill={p.color} opacity={p.opacity} transform={`rotate(${p.rotation},${p.x * window.innerWidth / 100},${p.y * window.innerHeight / 100})`} />
        })}
      </svg>
    </div>
  )
}

// ─── RSVP Form ───────────────────────────────────────────────────────────────
function RSVPForm() {
  const [form, setForm] = useState({ name: '', guests: '1', attending: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Prefer serverless/email service (EmailJS). If not configured, fallback to mailto.
    try {
      if (EMAIL_CONFIG.SERVICE_ID && EMAIL_CONFIG.TEMPLATE_ID && EMAIL_CONFIG.USER_ID) {
        const templateParams = {
          name: form.name,
          guests: form.guests,
          attending: form.attending,
          message: form.message,
          to_email: EMAIL_CONFIG.TO_EMAIL || '',
        }
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: EMAIL_CONFIG.SERVICE_ID,
            template_id: EMAIL_CONFIG.TEMPLATE_ID,
            user_id: EMAIL_CONFIG.USER_ID,
            template_params: templateParams,
          }),
        })
        if (!res.ok) {
          const txt = await res.text().catch(() => '<no body>')
          console.error('EmailJS error', res.status, txt)
          alert(`Failed to send RSVP (status ${res.status}): ${txt}`)
          return
        }
        setSubmitted(true)
        setConfetti(true)
        setTimeout(() => setConfetti(false), 4000)
      } else {
        // mailto fallback — opens user's email client prefilled
        const subject = encodeURIComponent("🎉 New RSVP Received for Elyana Reign's Birthday")
        const body = encodeURIComponent(
          `Hi Rainier,\n\nA new guest has responded to the invitation for Elyana Reign.\n\nGuest Name: ${form.name}\nAttending: ${form.attending}\nNumber of Guests: ${form.guests}\n\nMessage:\n${form.message || 'No message provided.'}\n\nSent from the Elyana Reign invitation website.`
        )
        const to = EMAIL_CONFIG.TO_EMAIL || ''
        if (!to) {
          alert('Please set an email destination in src/emailConfig.ts to use the mail fallback, or configure EmailJS.')
          return
        }
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
        setSubmitted(true)
      }
    } catch (err: any) {
      console.error('Send error', err)
      alert(`Failed to send RSVP: ${err?.message || String(err)}`)
    }
  }
  const field = "w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-purple-300"
  const fieldStyle = { background: 'rgba(255,255,255,0.75)', border: '1.5px solid rgba(155,111,200,0.25)', color: '#3b1f6e', fontFamily: "'Nunito',sans-serif" }
  return (
    <>
      <ConfettiBurst active={confetti} />
      {submitted ? (
        <div className="text-center py-8">
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
          <h3 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '1rem', color: '#7c3aed', marginBottom: '0.75rem' }}>Thank you, {form.name}!</h3>
          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#9b6fc8', lineHeight: 1.7 }}>
            {form.attending === 'yes'
              ? "We can't wait to see you at the royal party! See you on August 29! 👑"
              : "We'll miss you at the celebration. Thank you for letting us know! 💜"}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: '#7c3aed' }}>Your Name *</label>
            <input required className={field} style={fieldStyle} placeholder="Enter your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: '#7c3aed' }}>Number of Guests</label>
            <select className={field} style={fieldStyle} value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: '#7c3aed' }}>Will you attend?</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ k: 'yes', label: "✨ Yes! I'll be there" }, { k: 'no', label: "💌 Sorry, can't make it" }].map(({ k, label }) => (
                <button key={k} type="button" onClick={() => setForm({ ...form, attending: k })}
                  className="py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: form.attending === k ? 'linear-gradient(135deg,#9b6fc8,#c840a0)' : 'rgba(255,255,255,0.7)',
                    color: form.attending === k ? 'white' : '#7c3aed',
                    border: '1.5px solid rgba(155,111,200,0.25)',
                    fontFamily: "'Nunito',sans-serif",
                    transform: form.attending === k ? 'scale(1.02)' : 'scale(1)',
                  }}
                >{label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: '#7c3aed' }}>Birthday Message for Elyana</label>
            <textarea className={field} style={{ ...fieldStyle, resize: 'none' }} rows={3} placeholder="Write a sweet message for our little princess..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button type="submit"
            className="w-full py-4 rounded-2xl text-white font-bold text-sm tracking-widest mt-1 transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '0.75rem', background: 'linear-gradient(135deg,#9b6fc8,#c840a0,#7c3aed)', backgroundSize: '200%', boxShadow: '0 8px 32px rgba(168,85,247,0.4)' }}
          >
            ✨ Send My RSVP ✨
          </button>
        </form>
      )}
    </>
  )
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ id, children, style = {}, className = '' }: { id: string; children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return (
    <section id={id} ref={ref} className={className}
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(40px)', transition: 'opacity 0.9s ease, transform 0.9s ease', ...style }}
    >{children}</section>
  )
}

// ─── Section heading ─────────────────────────────────────────────────────────
function SectionHead({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10">
      <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h2 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.1rem,3vw,1.7rem)', background: 'linear-gradient(135deg,#7c3aed,#c840a0,#9b6fc8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.4rem' }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#9b6fc8', fontSize: '0.95rem' }}>{subtitle}</p>}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div style={{ height: 1, width: 48, background: 'linear-gradient(90deg,transparent,#c8a8e9)' }} />
        <span style={{ color: '#c8a8e9', fontSize: '0.7rem' }}>✦</span>
        <div style={{ height: 1, width: 48, background: 'linear-gradient(90deg,#c8a8e9,transparent)' }} />
      </div>
    </div>
  )
}

// ─── Floating Nav ─────────────────────────────────────────────────────────────
function FloatingNav({ visible }: { visible: boolean }) {
  const [active, setActive] = useState('welcome')
  useEffect(() => {
    const handler = () => {
      const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id))
      const scrollY = window.scrollY + 120
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i]
        if (el && el.offsetTop <= scrollY) { setActive(NAV_ITEMS[i].id); break }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <nav
      className="fixed left-1/2 z-50 transition-all duration-500"
      style={{
        bottom: 20,
        transform: `translateX(-50%) translateY(${visible ? '0' : '120px'})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="flex items-center gap-1 px-3 py-2 rounded-full"
        style={{ background: 'rgba(30,10,60,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(200,168,233,0.3)', boxShadow: '0 8px 40px rgba(124,58,237,0.4)' }}
      >
        {NAV_ITEMS.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="flex flex-col items-center px-2 py-1 rounded-full transition-all duration-200 group"
            style={{
              background: active === id ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'transparent',
              minWidth: 44,
            }}
            title={label}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: '0.5rem', fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: active === id ? 'white' : 'rgba(200,168,233,0.7)', letterSpacing: '0.05em', marginTop: 1 }}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// ─── Opening Animation ────────────────────────────────────────────────────────
function OpeningAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'doors' | 'sparkle' | 'done'>('doors')
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('sparkle'), 1000)
    const t2 = setTimeout(() => { setPhase('done'); onComplete() }, 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div className="fixed inset-0 z-[300] overflow-hidden pointer-events-none" style={{ background: 'linear-gradient(135deg,#2d1b4e,#1a0e30)' }}>
      {/* Castle doors opening */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Left door panel */}
        <div
          className="absolute"
          style={{
            width: '50%', height: '100%', left: 0,
            background: 'linear-gradient(180deg,#4a2080,#2d1b4e)',
            transformOrigin: 'left center',
            transform: phase === 'sparkle' ? 'perspective(600px) rotateY(-90deg)' : 'perspective(600px) rotateY(0deg)',
            transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)',
            borderRight: '2px solid rgba(200,168,233,0.3)',
          }}
        >
          <div className="w-full h-full flex items-center justify-end pr-8" style={{ opacity: phase === 'doors' ? 1 : 0, transition: 'opacity 0.3s' }}>
            <div style={{ fontSize: '4rem', color: 'rgba(200,168,233,0.6)' }}>⚜️</div>
          </div>
        </div>
        {/* Right door panel */}
        <div
          className="absolute"
          style={{
            width: '50%', height: '100%', right: 0,
            background: 'linear-gradient(180deg,#4a2080,#2d1b4e)',
            transformOrigin: 'right center',
            transform: phase === 'sparkle' ? 'perspective(600px) rotateY(90deg)' : 'perspective(600px) rotateY(0deg)',
            transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)',
            borderLeft: '2px solid rgba(200,168,233,0.3)',
          }}
        >
          <div className="w-full h-full flex items-center justify-start pl-8" style={{ opacity: phase === 'doors' ? 1 : 0, transition: 'opacity 0.3s' }}>
            <div style={{ fontSize: '4rem', color: 'rgba(200,168,233,0.6)' }}>⚜️</div>
          </div>
        </div>
      </div>

      {/* Burst sparkles */}
      {phase === 'sparkle' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * Math.PI * 2
            const dist = 80 + Math.random() * 120
            return (
              <div key={i} className="absolute" style={{
                left: '50%', top: '50%',
                transform: `translate(-50%,-50%) translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px)`,
                animation: `sparkle 0.8s ease-out forwards`,
                color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                fontSize: `${10 + Math.random() * 12}px`,
              }}>✦</div>
            )
          })}
          <div style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.5rem,5vw,3rem)', color: 'white', textAlign: 'center', textShadow: '0 0 40px rgba(200,168,233,0.9)' }}>
            👑<br />Welcome!
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PAGE 1: Landing ──────────────────────────────────────────────────────────
function LandingPage({ onOpen }: { onOpen: () => void }) {
  const [animating, setAnimating] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const handleClick = () => { setAnimating(true) }
  const handleAnimComplete = useCallback(() => { onOpen() }, [onOpen])

  const floatSparkles = [
    { x: '6%', y: '12%', d: 0, dur: 2.8, sz: 12 },
    { x: '88%', y: '8%', d: 0.4, dur: 3.2, sz: 16 },
    { x: '3%', y: '40%', d: 0.8, dur: 2.4, sz: 10 },
    { x: '92%', y: '35%', d: 1.2, dur: 2.9, sz: 14 },
    { x: '12%', y: '70%', d: 0.2, dur: 3.5, sz: 10 },
    { x: '85%', y: '68%', d: 0.9, dur: 2.6, sz: 12 },
    { x: '48%', y: '10%', d: 1.5, dur: 2.2, sz: 20 },
    { x: '50%', y: '88%', d: 0.3, dur: 3.1, sz: 8 },
    { x: '25%', y: '25%', d: 1.8, dur: 2.7, sz: 9 },
    { x: '72%', y: '20%', d: 0.6, dur: 3.4, sz: 11 },
  ]

  return (
    <>
      {animating && <OpeningAnimation onComplete={handleAnimComplete} />}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(180deg,#0f0520 0%,#2d1b4e 20%,#5a2d99 45%,#a060d8 65%,#d4a0e8 80%,#f0d0f5 95%,#fde8f8 100%)',
        }}
      >
        {/* Castle photo overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1774744799470-c2cbddfebf92?w=1400&h=900&fit=crop&auto=format"
            alt="Fairytale castle"
            className="w-full h-full object-cover"
            style={{ opacity: 0.12, mixBlendMode: 'luminosity' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(15,5,32,0.6) 0%,rgba(45,27,78,0.4) 40%,rgba(90,45,153,0.3) 70%,transparent 100%)' }} />
        </div>

        {/* Stars bg */}
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            left: `${5 + (i * 2.3) % 90}%`,
            top: `${3 + (i * 3.7) % 60}%`,
            width: i % 5 === 0 ? 3 : 2,
            height: i % 5 === 0 ? 3 : 2,
            borderRadius: '50%',
            background: 'white',
            opacity: 0.3 + (i % 5) * 0.1,
            animation: `twinkle ${1.5 + (i % 4) * 0.4}s ${(i % 7) * 0.3}s ease-in-out infinite`,
          }} />
        ))}

        {/* Sparkles */}
        {floatSparkles.map((s, i) => <Sparkle key={i} x={s.x} y={s.y} delay={s.d} duration={s.dur} size={s.sz} />)}

        {/* Butterflies */}
        <Butterfly x="8%" y="22%" delay={0} duration={7} size={1.1} />
        <Butterfly x="82%" y="18%" delay={1.2} duration={8.5} size={0.85} />
        <Butterfly x="5%" y="60%" delay={2} duration={6.5} />
        <Butterfly x="88%" y="58%" delay={0.5} duration={9} size={0.9} />

        {/* Hanging banners */}
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-6 md:gap-10 pointer-events-none z-10" style={{ paddingTop: 0 }}>
          {['♛', '✦', '♛', '✦', '♛', '✦', '♛'].map((ic, i) => (
            <div key={i} style={{
              background: `linear-gradient(180deg,${i % 2 === 0 ? '#7c3aed' : '#a855f7'},${i % 2 === 0 ? '#a855f7' : '#c840a0'})`,
              width: 20, height: 70,
              clipPath: 'polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 4,
              color: '#f5d0e8', fontSize: 9, opacity: 0.9,
              animation: `sway ${2.2 + i * 0.25}s ${i * 0.1}s ease-in-out infinite alternate`,
            }}>{ic}</div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-2xl mx-auto" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
          {/* Crown */}
          <div className="flex justify-center mb-4" style={{ animation: 'floatY 4s ease-in-out infinite' }}>
            <CrownSVG size={90} color="#f5d0e8" />
          </div>

          {/* You're Invited badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}>
            <span style={{ color: '#f5b8d0', fontSize: '0.55rem', fontFamily: "'Cinzel Decorative',serif", letterSpacing: '0.25em', textTransform: 'uppercase' }}>✦ You Are Invited ✦</span>
          </div>

          <h1 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.8rem,5.5vw,3.5rem)', color: 'white', lineHeight: 1.05, textShadow: '0 0 40px rgba(200,168,233,0.7), 0 4px 16px rgba(0,0,0,0.5)', marginBottom: '0.25rem' }}>
            Elyana Reign's
          </h1>
          <h1 style={{
            fontFamily: "'Cinzel Decorative',serif",
            fontSize: 'clamp(2.2rem,7vw,4.5rem)',
            lineHeight: 1,
            marginBottom: '2rem',
            background: 'linear-gradient(135deg,#f5d0e8,#c8a8e9,#f5b8d0,#e8d5f5)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 4s linear infinite',
          }}>
            2nd Birthday
          </h1>

          {/* Info pills */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { icon: '📅', text: 'Saturday, August 29, 2026' },
              { icon: '🕛', text: 'Lunch · 12:00 PM' },
              { icon: '📍', text: 'Pitpitac, Luna, La Union' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <span>{icon}</span>
                <span style={{ color: '#e8d5f5', fontFamily: "'Nunito',sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleClick}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            className="relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold transition-transform duration-200"
            style={{
              fontFamily: "'Cinzel Decorative',serif",
              fontSize: 'clamp(0.7rem,2vw,0.9rem)',
              letterSpacing: '0.12em',
              background: 'linear-gradient(135deg,#9b6fc8,#c840a0,#7c3aed)',
              backgroundSize: '200% 200%',
              animation: 'shimmer 3s linear infinite, glowPulse 2.5s ease-in-out infinite',
              transform: btnHover ? 'scale(1.06) translateY(-3px)' : 'scale(1) translateY(0)',
              boxShadow: btnHover ? '0 20px 60px rgba(168,85,247,0.6)' : '0 10px 40px rgba(168,85,247,0.35)',
            }}
          >
            <span>✨</span>
            <span>Open Royal Invitation</span>
            <span>✨</span>
          </button>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: '0.75rem', color: 'rgba(200,168,233,0.5)', marginTop: '0.75rem' }}>Tap to reveal the magical invitation</p>
        </div>

        {/* Castle silhouette at bottom */}
        <div className="absolute bottom-0 left-0 right-0 text-purple-900 pointer-events-none" style={{ opacity: 0.35 }}>
          <CastleSilhouette />
        </div>

        {/* Soft glow orbs */}
        <div className="absolute pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.25),transparent 70%)', top: '20%', left: '-10%', filter: 'blur(40px)' }} />
        <div className="absolute pointer-events-none" style={{ width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,130,200,0.2),transparent 70%)', top: '30%', right: '-8%', filter: 'blur(40px)' }} />
      </div>
    </>
  )
}

// ─── PAGE 2: Main Invitation ───────────────────────────────────────────────────
function InvitationPage() {
  return (
    <div style={{ background: '#faf5ff' }}>

      {/* ── WELCOME ── */}
      <Section id="welcome" style={{ background: 'linear-gradient(160deg,#f3e8ff,#fce7f3,#ede9fe)', padding: '5rem 1rem 4rem' }}>
        <div className="max-w-2xl mx-auto text-center">
          <SectionHead icon="👑" title="Welcome, Royal Guest" subtitle="You have been chosen to attend a most magical celebration" />
          <div className="relative mx-auto max-w-lg">
            <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.8)', borderRadius: 28, padding: '2rem 2.5rem', boxShadow: '0 8px 40px rgba(124,58,237,0.1)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2 text-xl">🌸🌺🌸</div>
              <p style={{ fontFamily: "'Playfair Display',serif", color: '#4a2080', lineHeight: 1.85, fontSize: '1rem', fontStyle: 'italic' }}>
                With hearts full of joy and love, we warmly invite you to join us in celebrating the second birthday of our little princess,{' '}
                <strong style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '0.85rem', color: '#7c3aed', fontStyle: 'normal' }}>Elyana Reign</strong>.
              </p>
              <div className="mt-4 pt-4 flex flex-wrap items-center justify-center gap-3" style={{ borderTop: '1px solid rgba(200,168,233,0.3)' }}>
                {[
                  { icon: '👸', label: 'Celebrant', val: 'Elyana Reign' },
                  { icon: '🎂', label: 'Turning', val: '2 Years Old' },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex flex-col items-center px-4" style={{ borderRight: '1px solid rgba(200,168,233,0.2)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                    <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: '0.6rem', color: '#9b6fc8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
                    <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '0.65rem', color: '#4a2080' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(124,58,237,0.16)]">
              <div className="bg-[#faf0ff]">
                <img src="/yana.png" alt="Yana invitation" className="w-full h-auto object-contain block" />
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-10">
            <SectionHead icon="💌" title="Royal RSVP" subtitle="Let us know if you'll be joining our little princess" />
            <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.85)', borderRadius: 28, padding: '2rem', boxShadow: '0 8px 40px rgba(124,58,237,0.1)' }}>
              <RSVPForm />
            </div>
          </div>
        </div>
      </Section>

      {/* ── COUNTDOWN ── */}
      <Section id="countdown" style={{ background: 'linear-gradient(135deg,#3b1f6e,#6d28d9,#9b6fc8)', padding: '5rem 1rem' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>⏳</div>
          <h2 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.1rem,3vw,1.6rem)', color: 'white', marginBottom: '0.5rem' }}>Counting Down to the Magic</h2>
          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#c8a8e9', marginBottom: '2.5rem', fontSize: '0.95rem' }}>The royal celebration begins in…</p>
          <Countdown />
        </div>
      </Section>

      {/* ── EVENT DETAILS ── */}
      <Section id="details" style={{ background: 'linear-gradient(160deg,#fde8f0,#f3e8ff,#e8f0fe)', padding: '5rem 1rem' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHead icon="✨" title="Event Details" subtitle="Everything you need for your royal arrival" />
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-start">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📅', label: 'Date', primary: 'Saturday', secondary: 'August 29, 2026', accent: '#c8a8e9' },
                { icon: '🕛', label: 'Time', primary: '12:00 PM', secondary: 'Lunch Celebration', accent: '#f5b8d0' },
                { icon: '📍', label: 'Venue', primary: 'Pitpitac', secondary: 'Luna, La Union', accent: '#b8d4f0' },
                { icon: '👗', label: 'Dress Code', primary: 'Pastel', secondary: 'Princess Attire', accent: '#fde8f0' },
              ].map(({ icon, label, primary, secondary, accent }) => (
                <div key={label} className="flex flex-col items-center text-center p-5 rounded-3xl"
                  style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: `1px solid ${accent}`, boxShadow: '0 4px 24px rgba(124,58,237,0.08)', borderTop: `3px solid ${accent}` }}
                >
                  <span style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{icon}</span>
                  <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: '0.6rem', fontWeight: 800, color: '#9b6fc8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</span>
                  <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '0.8rem', color: '#3b1f6e', lineHeight: 1.2 }}>{primary}</span>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#9b6fc8', fontSize: '0.8rem', marginTop: '0.2rem' }}>{secondary}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </Section>

      {/* ── STORY ── */}
      <Section id="story" style={{ background: 'white', padding: '5rem 1rem' }}>
        <div className="max-w-xl mx-auto text-center">
          <SectionHead icon="📖" title="A Royal Message" subtitle="From our family to yours" />
          <div className="relative" style={{ background: 'linear-gradient(160deg,#f3e8ff,#fce7f3)', borderRadius: 28, padding: '2.5rem', border: '1px solid rgba(200,168,233,0.3)' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#9b6fc8,#c840a0)', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 16px rgba(168,85,247,0.3)' }}>
              👸
            </div>
            <p style={{ fontFamily: "'Playfair Display',serif", color: '#4a2080', lineHeight: 2, fontSize: '1.05rem', fontStyle: 'italic', marginTop: '1rem' }}>
              "Our little princess is turning two! Every day she fills our world with magic, laughter, and endless wonder. We would be deeply honored to have you share in this magical day as we celebrate the joy that is{' '}
              <strong style={{ fontStyle: 'normal', color: '#7c3aed', fontFamily: "'Cinzel Decorative',serif", fontSize: '0.85rem' }}>Elyana Reign</strong>."
            </p>
            <div className="mt-4 pt-4 text-right" style={{ borderTop: '1px solid rgba(200,168,233,0.3)' }}>
              <span style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: '0.7rem', color: '#9b6fc8' }}>— With love, The Family</span>
            </div>
          </div>
          {/* Decorative butterflies */}
          <div className="flex justify-center gap-4 mt-6 opacity-60">
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ animation: `floatY ${3 + i}s ${i * 0.5}s ease-in-out infinite` }}>
                <svg width="24" height="16" viewBox="0 0 48 32" fill="none">
                  <ellipse cx="13" cy="13" rx="13" ry="9" fill="#c8a8e9" />
                  <ellipse cx="35" cy="13" rx="13" ry="9" fill="#f5b8d0" />
                  <line x1="24" y1="3" x2="24" y2="29" stroke="#9b6fc8" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── GALLERY ── */}
      <Section id="gallery" style={{ background: 'linear-gradient(160deg,#f3e8ff,#fde8f0)', padding: '5rem 1rem' }}>
        <div className="max-w-3xl mx-auto">
          <SectionHead icon="🖼️" title="Sweet Memories" subtitle="Beautiful moments to set the mood for our celebration" />
          <Gallery />
        </div>
      </Section>

      {/* ── LOCATION ── */}
      <Section id="location" style={{ background: 'white', padding: '5rem 1rem' }}>
        <div className="max-w-2xl mx-auto">
          <SectionHead icon="📍" title="Find the Royal Venue" subtitle="Join us in this magical location" />
          <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 8px 40px rgba(124,58,237,0.15)', border: '1px solid rgba(200,168,233,0.3)' }}>
            <iframe
              title="Venue – Pitpitac, Luna, La Union"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30591.7!2d120.3756!3d16.8504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33919f4d74b2b7ef%3A0x7db2ea9c21bdd6cc!2sLuna%2C%20La%20Union!5e0!3m2!1sen!2sph!4v1690000000000!5m2!1sen!2sph"
              width="100%" height="320" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-5" style={{ background: 'linear-gradient(135deg,rgba(243,232,255,0.8),rgba(252,231,243,0.8))' }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#4a2080', fontSize: '0.95rem' }}>
                📍 Pitpitac, Luna, La Union, Philippines
              </p>
              <a href="https://maps.google.com/?q=Luna,La+Union,Philippines" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm no-underline transition-transform duration-200 hover:scale-105"
                style={{ fontFamily: "'Nunito',sans-serif", background: 'linear-gradient(135deg,#9b6fc8,#c840a0)', boxShadow: '0 4px 16px rgba(168,85,247,0.3)' }}
              >
                🗺️ Get Directions
              </a>
            </div>
          </div>
        </div>
      </Section>



      {/* ── THANK YOU ── */}
      <Section style={{ background: 'linear-gradient(180deg,#1a0e30,#2d1b4e)', padding: '6rem 1rem', position: 'relative', overflow: 'hidden' }}>
        {/* Twinkling stars */}
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            left: `${5 + (i * 3.1) % 90}%`,
            top: `${5 + (i * 4.3) % 85}%`,
            color: ['#f5d0e8', '#c8a8e9', 'white', '#f5b8d0'][i % 4],
            fontSize: `${8 + (i % 3) * 4}px`,
            animation: `twinkle ${1.8 + (i % 4) * 0.35}s ${(i % 8) * 0.25}s ease-in-out infinite`,
          }}>
            {['✦', '✧', '⋆', '★'][i % 4]}
          </div>
        ))}
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <div style={{ animation: 'floatY 4s ease-in-out infinite', marginBottom: '1.5rem' }}>
            <CrownSVG size={70} color="#f5d0e8" />
          </div>
          <h2 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: 'clamp(1.1rem,3vw,1.7rem)', background: 'linear-gradient(135deg,#f5d0e8,#c8a8e9,#f5b8d0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>
            Thank You, Royal Guest!
          </h2>
          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', color: '#e8d5f5', fontSize: '1.05rem', lineHeight: 1.9, marginBottom: '2rem' }}>
            "We can't wait to celebrate with you! Come for a day of fun, laughter, and beautiful memories that will last a lifetime."
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg,transparent,#7c3aed)' }} />
            <span style={{ color: '#c8a8e9', fontSize: '0.8rem' }}>✦</span>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg,#7c3aed,transparent)' }} />
          </div>
          <div className="text-purple-900 opacity-20 mx-auto" style={{ maxWidth: 500 }}>
            <CastleSilhouette />
          </div>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: '0.7rem', color: 'rgba(200,168,233,0.4)', letterSpacing: '0.1em', marginTop: '1.5rem' }}>
            WITH LOVE · AUGUST 29, 2026 · PITPITAC, LUNA, LA UNION
          </p>
        </div>
      </Section>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<'landing' | 'invitation'>('landing')
  const [navVisible, setNavVisible] = useState(false)

  const handleOpen = useCallback(() => {
    setPage('invitation')
    setNavVisible(true)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }, [])

  useEffect(() => {
    if (page !== 'invitation') return
    const handler = () => setNavVisible(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [page])

  return (
    <>
      {page === 'landing' && <LandingPage onOpen={handleOpen} />}
      {page === 'invitation' && (
        <>
          <InvitationPage />
          <FloatingNav visible={navVisible} />
        </>
      )}
    </>
  )
}
