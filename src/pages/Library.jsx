import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { STATUSES, STATUS_COLORS, formatRating } from '../hooks/useStore'
import { Btn, SectionHeader, EmptyState, Badge } from '../components/UI'
import { Modal } from '../components/UI'
import EntryCard from '../components/EntryCard'
import EntryForm from '../components/EntryForm'
import EntryDetail from '../components/EntryDetail'

export default function Library({ entries, mediaTypes, ratingConfig, addEntry, updateEntry, deleteEntry }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState(searchParams.get('type') || 'all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [addOpen, setAddOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [detailEntry, setDetailEntry] = useState(null)

  useEffect(() => {
    const t = searchParams.get('type')
    if (t) setFilterType(t)
  }, [searchParams])

  const filtered = entries
    .filter(e => filterType === 'all' || e.mediaTypeId === filterType)
    .filter(e => filterStatus === 'all' || e.status === filterStatus)
    .filter(e => !search.trim() || e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())))

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'newest')    return b.createdAt - a.createdAt
    if (sort === 'oldest')    return a.createdAt - b.createdAt
    if (sort === 'rating-hi') return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)
    if (sort === 'rating-lo') return (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0)
    if (sort === 'title')     return a.title.localeCompare(b.title)
    return 0
  })

  const handleSaveAdd = (form) => { addEntry(form); setAddOpen(false) }
  const handleSaveEdit = (form) => { updateEntry(editEntry.id, form); setEditEntry(null) }
  const handleDelete = (id) => { if (window.confirm('Delete this entry?')) deleteEntry(id) }

  const usedTypes = [...new Set(entries.map(e => e.mediaTypeId))]

  return (
    <div className="anim-fadeUp">
      <SectionHeader
        title="My Library"
        subtitle={`${entries.length} entr${entries.length !== 1 ? 'ies' : 'y'} in your collection`}
        action={<Btn variant="accent" size="lg" onClick={() => setAddOpen(true)}>+ Add Entry</Btn>}
      />

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by title or tag…"
          style={{ flex: 1, minWidth: 200 }} />

        <select value={filterType} onChange={e => { setFilterType(e.target.value); setSearchParams(e.target.value !== 'all' ? { type: e.target.value } : {}) }}
          style={{ width: 'auto' }}>
          <option value="all">All Types</option>
          {mediaTypes.filter(m => usedTypes.includes(m.id)).map(m =>
            <option key={m.id} value={m.id}>{m.icon} {m.name}</option>)}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto' }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating-hi">Highest Rated</option>
          <option value="rating-lo">Lowest Rated</option>
          <option value="title">Title A→Z</option>
        </select>

        {/* View toggle */}
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {[['grid', '⊞', 'Grid'], ['list', '☰', 'List']].map(([v, icon, label]) => (
            <button key={v} onClick={() => setView(v)} title={label}
              style={{
                padding: '8px 13px', border: 'none', cursor: 'pointer', fontSize: 15,
                background: view === v ? 'var(--accent2)' : 'transparent',
                color: view === v ? '#fff' : 'var(--text2)',
                transition: 'all .15s',
              }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
        {sorted.length} result{sorted.length !== 1 ? 's' : ''}
        {sorted.length !== entries.length && ` of ${entries.length} total`}
      </div>

      {/* Empty state */}
      {sorted.length === 0 && entries.length === 0 && (
        <EmptyState
          icon="📭"
          title="Your library is empty"
          subtitle="Start tracking the media you love. Add movies, anime, books, and anything else you consume."
          action={<Btn variant="accent" size="lg" onClick={() => setAddOpen(true)}>+ Add Your First Entry</Btn>}
        />
      )}
      {sorted.length === 0 && entries.length > 0 && (
        <EmptyState icon="🔎" title="No results found" subtitle="Try adjusting your search or filters." />
      )}

      {/* Grid view */}
      {view === 'grid' && sorted.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: 16 }}>
          {sorted.map((e, i) => (
            <div key={e.id} className="anim-fadeUp" style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}>
              <EntryCard
                entry={e} mediaTypes={mediaTypes} ratingConfig={ratingConfig}
                onEdit={setEditEntry} onDelete={handleDelete}
                onClick={() => setDetailEntry(e)}
              />
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && sorted.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map(e => {
            const mt = mediaTypes.find(m => m.id === e.mediaTypeId)
            const statusColor = STATUS_COLORS[e.status] || '#6b7280'
            return (
              <div key={e.id} className="anim-fadeUp"
                onClick={() => setDetailEntry(e)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                  background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'border-color .15s, background .15s',
                }}
                onMouseEnter={e2 => { e2.currentTarget.style.borderColor = 'var(--border2)'; e2.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e2 => { e2.currentTarget.style.borderColor = 'var(--border)'; e2.currentTarget.style.background = 'var(--surface)' }}>

                {/* Cover */}
                {e.coverImage
                  ? <img src={e.coverImage} style={{ width: 36, height: 54, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  : <div style={{ width: 36, height: 54, borderRadius: 6, flexShrink: 0,
                      background: `linear-gradient(135deg,hsl(${(e.title.charCodeAt(0)||0)*3.6%360},50%,15%),hsl(${((e.title.charCodeAt(0)||0)*3.6+60)%360},40%,22%))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.6)',
                      fontSize: 12, fontWeight: 700, fontFamily: 'var(--ff-display)',
                    }}>{e.title.slice(0,2).toUpperCase()}</div>
                }

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="truncate" style={{ fontWeight: 600, fontSize: 15 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{mt?.icon} {mt?.name}</div>
                </div>

                <Badge color={statusColor} style={{ flexShrink: 0 }}>{e.status}</Badge>

                {e.rating !== null && e.rating !== undefined && (
                  <div style={{ fontFamily: 'var(--ff-mono)', color: 'var(--accent3)', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                    {formatRating(e.rating, ratingConfig)}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <Btn size="sm" variant="ghost" onClick={ev => { ev.stopPropagation(); setEditEntry(e) }}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={ev => { ev.stopPropagation(); handleDelete(e.id) }}>×</Btn>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Entry" width={600}>
        <EntryForm mediaTypes={mediaTypes} ratingConfig={ratingConfig}
          onSave={handleSaveAdd} onCancel={() => setAddOpen(false)} />
      </Modal>

      <Modal open={!!editEntry} onClose={() => setEditEntry(null)} title="Edit Entry" width={600}>
        {editEntry && (
          <EntryForm initial={editEntry} mediaTypes={mediaTypes} ratingConfig={ratingConfig}
            onSave={handleSaveEdit} onCancel={() => setEditEntry(null)} />
        )}
      </Modal>

      <EntryDetail
        entry={detailEntry} mediaTypes={mediaTypes} ratingConfig={ratingConfig}
        onClose={() => setDetailEntry(null)}
        onEdit={(e) => { setDetailEntry(null); setEditEntry(e) }}
        onDelete={(id) => { setDetailEntry(null); handleDelete(id) }}
      />
    </div>
  )
}
