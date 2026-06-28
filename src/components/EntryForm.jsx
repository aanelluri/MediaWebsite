import { useState, useRef } from 'react'
import { STATUSES, genId } from '../hooks/useStore'
import { Btn, RatingInput } from './UI'

export default function EntryForm({ initial, mediaTypes, ratingConfig, onSave, onCancel, onAddType, onUpdateRating }) {
  const [form, setForm] = useState(() => {
    const base = {
      title: '',
      mediaTypeId: mediaTypes[0]?.id || '',
      status: 'Plan to Consume',
      rating: null,
      review: '',
      coverImage: null,
      progress: '',
      rewatchCount: 0,
      notes: '',
      ...initial,
    }
    base.tags = Array.isArray(initial?.tags) ? initial.tags.join(', ') : (initial?.tags || '')
    return base
  })
  const fileRef = useRef()

  // Inline "add custom type" panel
  const [showAddType, setShowAddType] = useState(false)
  const [newTypeName, setNewTypeName] = useState('')
  const [newTypeIcon, setNewTypeIcon] = useState('📦')
  const TYPE_ICONS = ['📦','🎵','🎭','🎪','🏆','🎯','🎲','🌟','🔮','🎨','📻','🎤','🚀','🌈','🦋','🐉','🍿','☕','🧩','🔭']

  // Inline "adjust scale" panel
  const [showScale, setShowScale] = useState(false)
  const [scaleDraft, setScaleDraft] = useState({ ...ratingConfig })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAddType = () => {
    if (!newTypeName.trim() || !onAddType) return
    const id = genId()
    onAddType({ id, name: newTypeName.trim(), icon: newTypeIcon, color: '#a78bfa', custom: true })
    set('mediaTypeId', id)
    setNewTypeName('')
    setNewTypeIcon('📦')
    setShowAddType(false)
  }

  const handleSaveScale = () => {
    if (!onUpdateRating) return
    if (parseFloat(scaleDraft.max) <= parseFloat(scaleDraft.min)) { alert('Maximum must be greater than minimum.'); return }
    const next = { ...scaleDraft, min: parseFloat(scaleDraft.min), max: parseFloat(scaleDraft.max), precision: parseInt(scaleDraft.precision) }
    onUpdateRating(next)
    setShowScale(false)
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10MB'); return }
    const reader = new FileReader()
    reader.onload = ev => set('coverImage', ev.target.result)
    reader.readAsDataURL(file)
  }

  const submit = () => {
    if (!form.title.trim()) return
    onSave({
      ...form,
      title: form.title.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      rating: form.rating !== '' ? form.rating : null,
    })
  }

  const statusColors = {
    'Completed': '#10b981', 'In Progress': '#3b82f6',
    'Plan to Consume': '#6b7280', 'Dropped': '#f43f5e', 'On Hold': '#fbbf24',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Cover + Title/Type row */}
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
        {/* Cover upload */}
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          <div
            onClick={() => fileRef.current.click()}
            style={{
              width: 88, height: 130, borderRadius: 8, cursor: 'pointer', overflow: 'hidden',
              border: form.coverImage ? 'none' : '2px dashed var(--border2)',
              background: form.coverImage ? 'none' : 'var(--bg3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 6, transition: 'border-color .2s',
              position: 'relative',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
          >
            {form.coverImage
              ? <>
                  <img src={form.coverImage} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <span style={{ fontSize: 22 }}>📷</span>
                  </div>
                </>
              : <>
                  <span style={{ fontSize: 26, opacity: .5 }}>📷</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.3 }}>Upload cover</span>
                </>
            }
          </div>
        </div>

        {/* Title + Type */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Enter title…" autoFocus
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={labelStyle}>Media Type</label>
              {onAddType && (
                <button type="button" onClick={() => setShowAddType(s => !s)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent3)', cursor: 'pointer', fontSize: 11, fontWeight: 600, padding: 0 }}>
                  {showAddType ? '× cancel' : '+ new type'}
                </button>
              )}
            </div>
            <select value={form.mediaTypeId} onChange={e => set('mediaTypeId', e.target.value)}>
              {mediaTypes.map(m => <option key={m.id} value={m.id}>{m.icon} {m.name}</option>)}
            </select>
            {showAddType && (
              <div style={{ marginTop: 8, padding: 12, background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={newTypeIcon} onChange={e => setNewTypeIcon(e.target.value)} style={{ width: 64, fontSize: 18 }}>
                  {TYPE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
                <input value={newTypeName} onChange={e => setNewTypeName(e.target.value)}
                  placeholder="Category name (e.g. Board Games)"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddType())}
                  style={{ flex: 1, minWidth: 140 }} />
                <Btn size="sm" variant="accent" onClick={handleAddType} disabled={!newTypeName.trim()}>Add</Btn>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <label style={labelStyle}>Status</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => set('status', s)}
              style={{
                padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all .15s',
                background: form.status === s ? statusColors[s] : 'var(--surface)',
                color: form.status === s ? '#fff' : 'var(--text2)',
                border: form.status === s ? 'none' : '1px solid var(--border)',
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={labelStyle}>Rating</label>
          {onUpdateRating && (
            <button type="button" onClick={() => { setScaleDraft({ ...ratingConfig }); setShowScale(s => !s) }}
              style={{ background: 'none', border: 'none', color: 'var(--accent3)', cursor: 'pointer', fontSize: 11, fontWeight: 600, padding: 0 }}>
              {showScale ? '× cancel' : '⚙ adjust scale'}
            </button>
          )}
        </div>
        {showScale && (
          <div style={{ marginTop: 8, marginBottom: 12, padding: 14, background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ ...labelStyle, fontSize: 10 }}>Min</label>
                <input type="number" value={scaleDraft.min} onChange={e => setScaleDraft(c => ({ ...c, min: e.target.value }))} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: 10 }}>Max</label>
                <input type="number" value={scaleDraft.max} onChange={e => setScaleDraft(c => ({ ...c, max: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ ...labelStyle, fontSize: 10 }}>Decimal precision</label>
                <select value={scaleDraft.precision} onChange={e => setScaleDraft(c => ({ ...c, precision: parseInt(e.target.value) }))}>
                  <option value={0}>Whole numbers (e.g. 7)</option>
                  <option value={1}>1 decimal (e.g. 7.5)</option>
                  <option value={2}>2 decimals (e.g. 7.75)</option>
                  <option value={3}>3 decimals (e.g. 7.333)</option>
                </select>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>
              This updates your global rating scale for all entries.
            </div>
            <Btn size="sm" variant="accent" onClick={handleSaveScale}>Apply scale</Btn>
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <RatingInput value={form.rating} onChange={v => set('rating', v)} cfg={ratingConfig} />
        </div>
      </div>

      {/* Review */}
      <div>
        <label style={labelStyle}>Review</label>
        <textarea value={form.review} onChange={e => set('review', e.target.value)}
          placeholder="Write your thoughts… (no character limit)"
          rows={4} style={{ marginTop: 4 }} />
      </div>

      {/* Progress + Rewatch */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={labelStyle}>Progress</label>
          <input value={form.progress} onChange={e => set('progress', e.target.value)}
            placeholder="e.g. Ep 12 of 24, Ch 45…" style={{ marginTop: 4 }} />
        </div>
        <div>
          <label style={labelStyle}>Rewatch / Reread Count</label>
          <input type="number" min={0} value={form.rewatchCount}
            onChange={e => set('rewatchCount', parseInt(e.target.value) || 0)} style={{ marginTop: 4 }} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle}>Tags <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(comma-separated)</span></label>
        <input value={form.tags} onChange={e => set('tags', e.target.value)}
          placeholder="favorites, rewatch, masterpiece…" style={{ marginTop: 4 }} />
      </div>

      {/* Private notes */}
      <div>
        <label style={labelStyle}>Private Notes <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(never shown publicly)</span></label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Personal notes visible only to you…" rows={2} style={{ marginTop: 4 }} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn onClick={submit} disabled={!form.title.trim()} variant="accent">
          {initial?.id ? 'Save Changes' : 'Add to Library'}
        </Btn>
      </div>
    </div>
  )
}

const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', letterSpacing: .3, textTransform: 'uppercase' }
