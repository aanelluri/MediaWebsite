import { formatRating, STATUS_COLORS } from '../hooks/useStore'
import { Modal, Badge, Btn, RatingBar } from './UI'

export default function EntryDetail({ entry, mediaTypes, ratingConfig, onClose, onEdit, onDelete }) {
  if (!entry) return null
  const mt = mediaTypes.find(m => m.id === entry.mediaTypeId)
  const statusColor = STATUS_COLORS[entry.status] || '#6b7280'

  return (
    <Modal open={!!entry} onClose={onClose} title="" width={640}>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {/* Cover */}
        <div style={{ flexShrink: 0 }}>
          {entry.coverImage
            ? <img src={entry.coverImage} alt={entry.title}
                style={{ width: 110, height: 165, objectFit: 'cover', borderRadius: 10 }} />
            : <div style={{
                width: 110, height: 165, borderRadius: 10,
                background: `linear-gradient(135deg, hsl(${(entry.title.charCodeAt(0)||0)*3.6%360},50%,15%), hsl(${((entry.title.charCodeAt(0)||0)*3.6+60)%360},40%,22%))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--ff-display)', fontWeight: 900, fontSize: 28, color: 'rgba(255,255,255,.6)',
              }}>
                {entry.title.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()}
              </div>
          }
        </div>

        {/* Meta */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>{entry.title}</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge color={statusColor}>{entry.status}</Badge>
            {mt && <Badge color={mt.color || 'var(--accent)'}>{mt.icon} {mt.name}</Badge>}
          </div>
          {entry.rating !== null && entry.rating !== undefined && (
            <div style={{ marginTop: 4 }}>
              <RatingBar value={entry.rating} cfg={ratingConfig} />
            </div>
          )}
          {entry.progress && (
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>📍 Progress: {entry.progress}</div>
          )}
          {entry.rewatchCount > 0 && (
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>🔁 Rewatched / reread {entry.rewatchCount}×</div>
          )}
          {entry.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {entry.tags.map(t => (
                <span key={t} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 99,
                  background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review */}
      {entry.review && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>Review</div>
          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '14px 16px',
            fontSize: 14, lineHeight: 1.7, color: 'var(--text2)', borderLeft: '3px solid var(--accent2)',
            whiteSpace: 'pre-wrap' }}>
            {entry.review}
          </div>
        </div>
      )}

      {/* Private notes */}
      {entry.notes && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>Private Notes</div>
          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '12px 16px',
            fontSize: 13, lineHeight: 1.6, color: 'var(--text3)', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
            {entry.notes}
          </div>
        </div>
      )}

      {/* Added date */}
      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 20 }}>
        Added {new Date(entry.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {entry.updatedAt && ` · Updated ${new Date(entry.updatedAt).toLocaleDateString()}`}
      </div>

      <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <Btn variant="accent" onClick={() => { onClose(); onEdit(entry) }}>Edit Entry</Btn>
        <Btn variant="danger" onClick={() => { onClose(); onDelete(entry.id) }}>Delete</Btn>
        <Btn variant="ghost" onClick={onClose} style={{ marginLeft: 'auto' }}>Close</Btn>
      </div>
    </Modal>
  )
}
