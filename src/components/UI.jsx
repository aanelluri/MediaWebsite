import { useEffect } from 'react'
import { placeholderGradient, initials, formatRating, ratingPercent } from '../hooks/useStore'

/* ── Button ─────────────────────────────────────────────────────────────── */
export function Btn({ children, onClick, variant = 'primary', size = 'md', style: sx, disabled, type = 'button' }) {
  const sizes = {
    sm: { padding: '6px 14px', fontSize: 12 },
    md: { padding: '9px 20px', fontSize: 14 },
    lg: { padding: '12px 28px', fontSize: 15 },
  }
  const variants = {
    primary: { background: 'var(--accent2)', color: '#fff', border: 'none' },
    ghost:   { background: 'transparent', color: 'var(--text2)', border: '1.5px solid var(--border2)' },
    danger:  { background: 'rgba(244,63,94,.12)', color: 'var(--rose)', border: '1.5px solid rgba(244,63,94,.28)' },
    surface: { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' },
    accent:  { background: 'linear-gradient(135deg,var(--accent2),#5b21b6)', color: '#fff', border: 'none' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 'var(--r2)',
        fontFamily: 'var(--ff-body)', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .45 : 1, transition: 'all .18s', lineHeight: 1,
        ...sizes[size], ...variants[variant], ...sx,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.15)' }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}>
      {children}
    </button>
  )
}

/* ── Badge ──────────────────────────────────────────────────────────────── */
export function Badge({ children, color = 'var(--accent)', style: sx }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 99,
      fontSize: 11, fontWeight: 600, letterSpacing: .3,
      background: `${color}22`, color, border: `1px solid ${color}44`, ...sx,
    }}>
      {children}
    </span>
  )
}

/* ── Modal ──────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, width = 560 }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="anim-fadeIn" onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.72)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, backdropFilter: 'blur(4px)',
      }}>
      <div className="anim-fadeUp" onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 16, width: '100%', maxWidth: width,
          maxHeight: '90vh', overflow: 'auto', boxShadow: 'var(--sh2)',
        }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px 16px', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, background: 'var(--bg2)', zIndex: 1,
        }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 20, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 24, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>
            ×
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

/* ── Cover Image ─────────────────────────────────────────────────────────── */
export function CoverImage({ entry, width = 120, aspectRatio = '2/3', radius = 8, style: sx }) {
  const height = typeof width === 'number' ? Math.round(width * 1.5) : undefined
  if (entry.coverImage) {
    return (
      <img src={entry.coverImage} alt={entry.title}
        style={{ width, height, objectFit: 'cover', borderRadius: radius, flexShrink: 0, display: 'block', ...sx }} />
    )
  }
  return (
    <div style={{
      width, height, borderRadius: radius, flexShrink: 0,
      background: placeholderGradient(entry.title),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--ff-display)', fontWeight: 900,
      fontSize: typeof width === 'number' ? Math.round(width * .28) : 24,
      color: 'rgba(255,255,255,.65)', userSelect: 'none', ...sx,
    }}>
      {initials(entry.title)}
    </div>
  )
}

/* ── Rating Bar ──────────────────────────────────────────────────────────── */
export function RatingBar({ value, cfg, showLabel = true }) {
  const pct = ratingPercent(value, cfg)
  return (
    <div>
      {showLabel && (
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--accent3)', fontWeight: 500 }}>
          {formatRating(value, cfg)}
        </span>
      )}
      <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginTop: showLabel ? 5 : 0 }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 2,
          background: 'linear-gradient(90deg, var(--accent2), var(--accent3))',
          transition: 'width .4s ease',
        }} />
      </div>
    </div>
  )
}

/* ── Rating Input ────────────────────────────────────────────────────────── */
export function RatingInput({ value, onChange, cfg }) {
  const safeVal = value !== null && value !== undefined ? value : ''

  const commit = (raw) => {
    if (raw === '' || raw === null) { onChange(null); return }
    const n = parseFloat(raw)
    if (isNaN(n)) { onChange(null); return }
    const clamped = parseFloat(Math.min(cfg.max, Math.max(cfg.min, n)).toFixed(cfg.precision))
    onChange(clamped)
  }

  const sliderVal = safeVal !== '' && !isNaN(parseFloat(safeVal)) ? parseFloat(safeVal) : cfg.min

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="number"
          value={safeVal}
          min={cfg.min} max={cfg.max}
          step={cfg.step || Math.pow(10, -cfg.precision)}
          placeholder={`${cfg.min}–${cfg.max}`}
          onChange={e => onChange(e.target.value === '' ? null : e.target.value)}
          onBlur={e => commit(e.target.value)}
          style={{ width: 120 }}
        />
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 14, color: 'var(--accent3)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {safeVal !== '' && !isNaN(parseFloat(safeVal))
            ? `${parseFloat(safeVal).toFixed(cfg.precision)} / ${cfg.max}`
            : `— / ${cfg.max}`}
        </span>
        {safeVal !== '' && (
          <button onClick={() => onChange(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16 }}
            title="Clear rating">×</button>
        )}
      </div>
      {/* Slider */}
      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, background: 'var(--border)', borderRadius: 2 }} />
        <div style={{
          position: 'absolute', left: 0, height: 4, borderRadius: 2,
          width: `${ratingPercent(sliderVal, cfg)}%`,
          background: 'linear-gradient(90deg, var(--accent2), var(--accent3))',
          transition: 'width .08s',
        }} />
        <input type="range"
          min={cfg.min} max={cfg.max}
          step={cfg.step || Math.pow(10, -cfg.precision)}
          value={sliderVal}
          onChange={e => {
            const n = parseFloat(parseFloat(e.target.value).toFixed(cfg.precision))
            onChange(n)
          }}
          style={{
            position: 'absolute', left: 0, right: 0, width: '100%', opacity: 0,
            height: 20, cursor: 'pointer', margin: 0, padding: 0,
          }}
        />
        {/* Thumb indicator */}
        <div style={{
          position: 'absolute', width: 14, height: 14, borderRadius: '50%',
          background: 'var(--accent)', border: '2px solid var(--accent3)',
          left: `calc(${ratingPercent(sliderVal, cfg)}% - 7px)`,
          transition: 'left .08s', pointerEvents: 'none',
          boxShadow: '0 0 8px rgba(167,139,250,.5)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)' }}>
        <span>{cfg.min}</span>
        <span>Scale: {cfg.min}–{cfg.max} · Precision: {cfg.precision} decimal{cfg.precision !== 1 ? 's' : ''}</span>
        <span>{cfg.max}</span>
      </div>
    </div>
  )
}

/* ── Section Header ──────────────────────────────────────────────────────── */
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/* ── Empty State ─────────────────────────────────────────────────────────── */
export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '72px 24px', color: 'var(--text3)' }}>
      <div style={{ fontSize: 52, marginBottom: 16, opacity: .7 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: 20, color: 'var(--text2)', marginBottom: 8 }}>{title}</div>
      {subtitle && <p style={{ fontSize: 14, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>{subtitle}</p>}
      {action}
    </div>
  )
}

/* ── Stat Card ───────────────────────────────────────────────────────────── */
export function StatCard({ icon, label, value, color = 'var(--accent3)' }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--r)', padding: '20px 24px',
      border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 26, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500, letterSpacing: .5, textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
    </div>
  )
}
