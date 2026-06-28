import { useState } from 'react'
import { genId } from '../hooks/useStore'
import { Btn } from '../components/UI'

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    setError('')
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return }
    if (mode === 'signup' && !name.trim()) { setError('Please enter a display name.'); return }
    const user = {
      id: genId(),
      email: email.trim(),
      name: name.trim() || email.split('@')[0],
      createdAt: Date.now(),
    }
    onLogin(user)
  }

  const FEATURES = [
    { icon: '⭐', title: 'Any Rating Scale', desc: 'Rate 3.75/5 or 9.33/10 — any precision, any scale.' },
    { icon: '🎭', title: 'Any Media Type', desc: 'Movies, anime, manga, podcasts, or create your own.' },
    { icon: '📷', title: 'Your Cover Art', desc: 'Upload your own images for every entry.' },
    { icon: '📝', title: 'Full Reviews', desc: 'Write as much as you want with no character limits.' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* Left — Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 64px', position: 'relative', overflow: 'hidden',
      }}>
        {/* BG decoration */}
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '70%', height: '70%',
          background: 'radial-gradient(circle, rgba(124,58,237,.14) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '55%', height: '55%',
          background: 'radial-gradient(circle, rgba(167,139,250,.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="anim-fadeUp" style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ fontSize: 36 }}>🎬</div>
            <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 900, fontSize: 26,
              background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MediaVault
            </div>
          </div>

          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            Your media.<br />
            <span style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your rules.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 460, marginBottom: 52 }}>
            The only media tracker that lets you rate exactly how you feel — 3.75/5, 9.33/10, anything.
            Fully customizable, completely yours.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 520 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="anim-fadeUp" style={{ animationDelay: `${i * 0.08 + 0.2}s`,
                background: 'var(--surface)', borderRadius: 12, padding: '18px 20px',
                border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div style={{ width: 420, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 40px', background: 'var(--bg2)', borderLeft: '1px solid var(--border)' }}>
        <div className="anim-slideLeft" style={{ width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 26, fontWeight: 900, marginBottom: 6 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your vault'}
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 28 }}>
            {mode === 'login' ? 'Sign in to access your library.' : 'Free to use. Data saved in your browser.'}
          </p>

          {/* Mode tabs */}
          <div style={{ display: 'flex', background: 'var(--bg3)', borderRadius: 8, padding: 4, marginBottom: 24 }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 6, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, fontFamily: 'var(--ff-body)', transition: 'all .15s',
                  background: mode === m ? 'var(--accent2)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text2)' }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label style={lStyle}>Display Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoFocus />
              </div>
            )}
            <div>
              <label style={lStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                autoFocus={mode === 'login'} />
            </div>
            <div>
              <label style={lStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && submit()} />
            </div>

            {error && (
              <div style={{ fontSize: 13, color: 'var(--rose)', background: 'rgba(244,63,94,.1)',
                border: '1px solid rgba(244,63,94,.2)', borderRadius: 8, padding: '10px 14px' }}>
                {error}
              </div>
            )}

            <Btn variant="accent" size="lg" onClick={submit} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </Btn>
          </div>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
            {mode === 'login'
              ? 'Any email and password works for this demo. Your data is stored locally.'
              : 'No server, no tracking. Everything is stored in your browser.'}
          </p>
        </div>
      </div>
    </div>
  )
}

const lStyle = { fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 6, letterSpacing: .5, textTransform: 'uppercase' }
