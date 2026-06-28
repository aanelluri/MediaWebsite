import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NAV = [
  { to: '/library',  label: 'Library',  icon: '📚' },
  { to: '/stats',    label: 'Stats',    icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ user, entries, mediaTypes, onLogout }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const typeCount = {}
  entries.forEach(e => { typeCount[e.mediaTypeId] = (typeCount[e.mediaTypeId] || 0) + 1 })
  const usedTypes = mediaTypes.filter(m => typeCount[m.id])

  return (
    <aside style={{
      width: collapsed ? 64 : 240, flexShrink: 0,
      background: 'var(--bg2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width .25s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden', position: 'sticky', top: 0, height: '100vh', zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{
        padding: '18px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, minHeight: 64, flexShrink: 0,
      }}>
        <div style={{ fontSize: 26, flexShrink: 0 }}>🎬</div>
        {!collapsed && (
          <div style={{
            fontFamily: 'var(--ff-display)', fontWeight: 900, fontSize: 19, whiteSpace: 'nowrap',
            background: 'linear-gradient(135deg, var(--accent3) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            MediaVault
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text3)',
            cursor: 'pointer', fontSize: 14, flexShrink: 0, padding: 4, borderRadius: 4,
            lineHeight: 1,
          }}
          title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 8px', flex: 1, overflow: 'auto' }}>
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 'var(--r2)', marginBottom: 2,
              textDecoration: 'none', transition: 'all .15s', fontSize: 14,
              background: isActive ? 'rgba(124,58,237,.22)' : 'transparent',
              color: isActive ? 'var(--accent3)' : 'var(--text2)',
              fontWeight: isActive ? 600 : 400,
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
            })}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
          </NavLink>
        ))}

        {/* Collection section */}
        {!collapsed && usedTypes.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text3)',
              padding: '0 12px', marginBottom: 8, textTransform: 'uppercase',
            }}>
              Collection
            </div>
            {usedTypes.map(mt => (
              <NavLink key={mt.id} to={`/library?type=${mt.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 12px', borderRadius: 6, textDecoration: 'none',
                  color: 'var(--text2)', fontSize: 13, transition: 'background .15s',
                  background: location.search.includes(`type=${mt.id}`) ? 'var(--surface)' : 'transparent',
                }}>
                <span style={{ fontSize: 14 }}>{mt.icon}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{mt.name}</span>
                <span style={{
                  fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text3)',
                  background: 'var(--bg3)', padding: '1px 6px', borderRadius: 99,
                }}>
                  {typeCount[mt.id]}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* User */}
      <div style={{
        padding: '12px 14px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent2), #5b21b6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, color: '#fff',
        }}>
          {(user?.name || user?.email || '?')[0].toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="truncate" style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{entries.length} entr{entries.length !== 1 ? 'ies' : 'y'}</div>
            </div>
            <button onClick={onLogout} title="Sign out"
              style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, padding: 4 }}>
              ⎋
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
