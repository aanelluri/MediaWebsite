import { formatRating, STATUS_COLORS, STATUSES } from '../hooks/useStore'
import { SectionHeader, StatCard } from '../components/UI'

export default function Stats({ entries, mediaTypes, ratingConfig }) {
  const total = entries.length
  const rated = entries.filter(e => e.rating !== null && e.rating !== undefined && e.rating !== '')
  const completed = entries.filter(e => e.status === 'Completed')

  const avgRating = rated.length > 0
    ? (rated.reduce((s, e) => s + parseFloat(e.rating), 0) / rated.length).toFixed(ratingConfig.precision)
    : null

  const byType = mediaTypes
    .map(mt => ({ ...mt, count: entries.filter(e => e.mediaTypeId === mt.id).length }))
    .filter(mt => mt.count > 0)
    .sort((a, b) => b.count - a.count)

  const maxTypeCount = byType[0]?.count || 1

  const byStatus = STATUSES.map(s => ({
    status: s, count: entries.filter(e => e.status === s).length
  })).filter(s => s.count > 0)

  const topRated = [...rated]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 8)

  return (
    <div className="anim-fadeUp">
      <SectionHeader title="Statistics" subtitle="A snapshot of your media consumption" />

      {total === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text3)' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📊</div>
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 20, color: 'var(--text2)' }}>No data yet</div>
          <p style={{ fontSize: 14, marginTop: 8 }}>Add some entries to see your stats.</p>
        </div>
      )}

      {total > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
            <StatCard icon="📚" label="Total Entries" value={total} />
            <StatCard icon="✅" label="Completed" value={completed.length} color="var(--green)" />
            <StatCard icon="⭐" label="Average Rating" value={avgRating ? `${avgRating}/${ratingConfig.max}` : '—'} color="var(--gold)" />
            <StatCard icon="🎭" label="Media Types" value={byType.length} color="var(--teal)" />
            <StatCard icon="📝" label="Rated" value={rated.length} color="var(--accent3)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* By Type */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: 24, border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 17, marginBottom: 18, color: 'var(--text2)' }}>By Media Type</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {byType.map(mt => (
                  <div key={mt.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                      <span>{mt.icon} {mt.name}</span>
                      <span style={{ fontFamily: 'var(--ff-mono)', color: 'var(--text3)' }}>{mt.count}</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3 }}>
                      <div style={{ height: '100%', borderRadius: 3, transition: 'width .5s ease',
                        width: `${(mt.count / maxTypeCount) * 100}%`,
                        background: mt.color || 'var(--accent)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Status */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: 24, border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 17, marginBottom: 18, color: 'var(--text2)' }}>By Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {byStatus.map(({ status, count }) => (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                      <span style={{ color: STATUS_COLORS[status] || 'var(--text2)' }}>{status}</span>
                      <span style={{ fontFamily: 'var(--ff-mono)', color: 'var(--text3)' }}>
                        {count} <span style={{ color: 'var(--text3)', fontSize: 11 }}>({Math.round(count/total*100)}%)</span>
                      </span>
                    </div>
                    <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 3 }}>
                      <div style={{ height: '100%', borderRadius: 3, transition: 'width .5s ease',
                        width: `${(count / total) * 100}%`,
                        background: STATUS_COLORS[status] || 'var(--accent)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Rated */}
          {topRated.length > 0 && (
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: 24, border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 17, marginBottom: 18, color: 'var(--text2)' }}>Top Rated</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
                {topRated.map((e, i) => {
                  const mt = mediaTypes.find(m => m.id === e.mediaTypeId)
                  return (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text3)', width: 24, textAlign: 'center' }}>
                        #{i + 1}
                      </div>
                      {e.coverImage
                        ? <img src={e.coverImage} style={{ width: 32, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                        : <div style={{ width: 32, height: 48, borderRadius: 4, flexShrink: 0,
                            background: `linear-gradient(135deg,hsl(${(e.title.charCodeAt(0)||0)*3.6%360},50%,15%),hsl(${((e.title.charCodeAt(0)||0)*3.6+60)%360},40%,22%))`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
                            color: 'rgba(255,255,255,.6)', fontFamily: 'var(--ff-display)' }}>
                            {e.title.slice(0,2).toUpperCase()}
                          </div>
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="truncate" style={{ fontWeight: 600, fontSize: 13 }}>{e.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{mt?.icon} {mt?.name}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--ff-mono)', color: 'var(--gold)', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                        {formatRating(e.rating, ratingConfig)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
