import { useState } from 'react'
import { PRESET_TYPES, genId } from '../hooks/useStore'
import { Btn, Badge, SectionHeader } from '../components/UI'

const ICONS = ['📦','🎵','🎭','🎪','🏆','🎯','🃏','🌟','🔮','🎻','🎹','🖼️','🎨','📻','🎤','📡','🎲','🃟',
  '🏅','🎠','🎡','🎢','🏋️','🤿','🎿','🛸','🚀','🌈','🦋','🦊','🐉','🌺','🍿','☕','🧩','🔭','🎭']

export default function Settings({ ratingConfig, setRatingConfig, mediaTypes, setMediaTypes }) {
  const [cfg, setCfg] = useState({ ...ratingConfig })
  const [saved, setSaved] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📦')
  const [newColor, setNewColor] = useState('#a78bfa')

  const saveRating = () => {
    if (cfg.max <= cfg.min) { alert('Maximum must be greater than minimum.'); return }
    setRatingConfig({ ...cfg, min: parseFloat(cfg.min), max: parseFloat(cfg.max) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addType = () => {
    if (!newName.trim()) return
    setMediaTypes(prev => [...prev, {
      id: genId(), name: newName.trim(), icon: newIcon, color: newColor, custom: true,
    }])
    setNewName('')
    setNewIcon('📦')
    setNewColor('#a78bfa')
  }

  const removeType = (id) => {
    const mt = mediaTypes.find(m => m.id === id)
    if (!mt) return
    if (!window.confirm(`Remove "${mt.name}"? This only removes it from the type list — existing entries won't be deleted.`)) return
    setMediaTypes(prev => prev.filter(m => m.id !== id))
  }

  const resetTypes = () => {
    if (!window.confirm('Reset to default preset types? Custom types will be removed.')) return
    setMediaTypes(PRESET_TYPES)
  }

  const preview = cfg.min !== '' && cfg.max !== ''
    ? (parseFloat(cfg.min) + (parseFloat(cfg.max) - parseFloat(cfg.min)) * 0.75).toFixed(parseInt(cfg.precision) || 0)
    : '?'

  return (
    <div className="anim-fadeUp">
      <SectionHeader title="Settings" subtitle="Customize your MediaVault experience" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>

        {/* ── Rating System ── */}
        <section style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: 28, border: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 20, marginBottom: 6 }}>Rating System</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
            Configure your personal rating scale. Choose any min/max and as many decimal places as you want —
            rate something <strong style={{ color: 'var(--accent3)' }}>3.75/5</strong> or <strong style={{ color: 'var(--accent3)' }}>9.33/10</strong>, no restrictions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Minimum Value</label>
              <input type="number" value={cfg.min}
                onChange={e => setCfg(c => ({ ...c, min: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Maximum Value</label>
              <input type="number" value={cfg.max}
                onChange={e => setCfg(c => ({ ...c, max: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Decimal Precision</label>
              <select value={cfg.precision} onChange={e => setCfg(c => ({ ...c, precision: parseInt(e.target.value) }))}>
                <option value={0}>Whole numbers only  (e.g. 7)</option>
                <option value={1}>1 decimal place  (e.g. 7.5)</option>
                <option value={2}>2 decimal places  (e.g. 7.75)</option>
                <option value={3}>3 decimal places  (e.g. 7.333)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Slider Step <span style={{ color: 'var(--text3)', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
              <input type="number" value={cfg.step || ''} placeholder="Leave blank for free input"
                onChange={e => setCfg(c => ({ ...c, step: e.target.value ? parseFloat(e.target.value) : null }))} />
            </div>
          </div>

          {/* Preview */}
          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '12px 18px', marginBottom: 20,
            borderLeft: '3px solid var(--accent2)', fontSize: 14, color: 'var(--text2)' }}>
            Preview: a 75% score would be rated{' '}
            <strong style={{ fontFamily: 'var(--ff-mono)', color: 'var(--accent3)', fontSize: 16 }}>{preview}</strong>
            {' '}out of{' '}
            <strong style={{ fontFamily: 'var(--ff-mono)', color: 'var(--accent3)', fontSize: 16 }}>{cfg.max}</strong>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Btn variant="accent" onClick={saveRating}>Save Rating Config</Btn>
            {saved && <span style={{ color: 'var(--green)', fontSize: 14 }}>✓ Saved!</span>}
          </div>
        </section>

        {/* ── Media Types ── */}
        <section style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: 28, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 20 }}>Media Types</h2>
            <Btn size="sm" variant="ghost" onClick={resetTypes}>Reset to defaults</Btn>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
            Add custom media types for anything you track — podcasts, stage plays, board games, video essays, whatever you want.
          </p>

          {/* Add new */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center',
            padding: '16px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <select value={newIcon} onChange={e => setNewIcon(e.target.value)} style={{ width: 80, fontSize: 20 }}>
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="New media type name…"
              onKeyDown={e => e.key === 'Enter' && addType()}
              style={{ flex: 1, minWidth: 160 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>Color</label>
              <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)}
                style={{ width: 40, height: 36, padding: 4, cursor: 'pointer', borderRadius: 6 }} />
            </div>
            <Btn variant="accent" onClick={addType} disabled={!newName.trim()}>Add Type</Btn>
          </div>

          {/* Type list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mediaTypes.map(mt => (
              <div key={mt.id} style={{ display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{mt.icon}</span>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: mt.color || '#6b7280', flexShrink: 0 }} />
                <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{mt.name}</span>
                {mt.custom
                  ? <Badge color="var(--accent)">Custom</Badge>
                  : <Badge color="var(--text3)">Preset</Badge>
                }
                <button onClick={() => removeType(mt.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px' }}
                  title="Remove type">×</button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Export ── */}
        <section style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: 28, border: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 20, marginBottom: 6 }}>Data Export</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
            Download a full backup of your library at any time. Your data is yours.
          </p>
          <Btn variant="ghost" onClick={() => {
            const data = {
              exported: new Date().toISOString(),
              ratingConfig,
              mediaTypes,
              entries: JSON.parse(localStorage.getItem('mv_entries') || '[]'),
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url; a.download = `mediavault-export-${Date.now()}.json`; a.click()
            URL.revokeObjectURL(url)
          }}>
            ⬇ Export Library as JSON
          </Btn>
        </section>

      </div>
    </div>
  )
}

const labelStyle = {
  fontSize: 11, fontWeight: 700, color: 'var(--text2)', display: 'block',
  marginBottom: 6, letterSpacing: .5, textTransform: 'uppercase',
}
