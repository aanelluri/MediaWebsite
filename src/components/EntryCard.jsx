import { useState } from 'react'
import { formatRating, ratingPercent, STATUS_COLORS } from '../hooks/useStore'
import { CoverImage, Badge, Btn } from './UI'

export default function EntryCard({ entry, mediaTypes, ratingConfig, onEdit, onDelete, onClick }) {
  const [hovered, setHovered] = useState(false)
  const mt = mediaTypes.find(m => m.id === entry.mediaTypeId)
  const pct = ratingPercent(entry.rating, ratingConfig)
  const statusColor = STATUS_COLORS[entry.status] || '#6b7280'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'var(--border2)' : 'var(--border)'}`,
        transition: 'transform .2s, box-shadow .2s, border-color .2s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,.5)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* Cover */}
      <div style={{ position: 'relative', paddingTop: '150%', overflow: 'hidden', background: 'var(--bg3)', flexShrink: 0 }}>
        {entry.coverImage
          ? <img src={entry.coverImage} alt={entry.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform .3s', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
          : <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, hsl(${(entry.title.charCodeAt(0)||0)*3.6%360},50%,15%) 0%, hsl(${((entry.title.charCodeAt(0)||0)*3.6+60)%360},40%,22%) 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--ff-display)', fontWeight: 900, fontSize: 36, color: 'rgba(255,255,255,.55)',
            }}>
              {entry.title.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?'}
            </div>
        }

        {/* Overlay badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Badge color={statusColor} style={{ fontSize: 10, padding: '2px 8px' }}>{entry.status}</Badge>
          <div style={{ background: 'rgba(0,0,0,.65)', borderRadius: 6, padding: '3px 7px', fontSize: 16, lineHeight: 1 }}>
            {mt?.icon || '📦'}
          </div>
        </div>

        {/* Rating chip */}
        {entry.rating !== null && entry.rating !== undefined && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(6px)',
            borderRadius: 6, padding: '4px 8px',
            fontFamily: 'var(--ff-mono)', fontSize: 12, fontWeight: 600, color: 'var(--accent3)',
            border: '1px solid rgba(167,139,250,.3)',
          }}>
            {parseFloat(entry.rating).toFixed(ratingConfig.precision)}/{ratingConfig.max}
          </div>
        )}

        {/* Hover action overlay */}
        {hovered && (
          <div className="anim-fadeIn"
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, transparent 50%)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, padding: '0 12px 12px' }}>
            <Btn size="sm" variant="surface" onClick={e => { e.stopPropagation(); onEdit(entry) }}>Edit</Btn>
            <Btn size="sm" variant="danger" onClick={e => { e.stopPropagation(); onDelete(entry.id) }}>Delete</Btn>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="truncate" style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', lineHeight: 1.3 }}
          title={entry.title}>
          {entry.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>{mt?.name || entry.mediaTypeId}</div>

        {/* Rating bar */}
        {entry.rating !== null && entry.rating !== undefined && (
          <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginTop: 4 }}>
            <div style={{
              height: '100%', width: `${pct}%`, borderRadius: 2,
              background: `linear-gradient(90deg, var(--accent2), var(--accent3))`,
            }} />
          </div>
        )}

        {/* Tags */}
        {entry.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
            {entry.tags.slice(0, 3).map(t => (
              <span key={t} style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 99,
                background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
              }}>{t}</span>
            ))}
            {entry.tags.length > 3 && (
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>+{entry.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
