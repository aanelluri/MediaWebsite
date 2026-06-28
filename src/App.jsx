import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './hooks/useStore'
import Auth from './pages/Auth'
import Library from './pages/Library'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import Sidebar from './components/Sidebar'

export default function App() {
  const store = useStore()
  const { user, setUser, logout, entries, addEntry, updateEntry, deleteEntry, mediaTypes, setMediaTypes, ratingConfig, setRatingConfig } = store

  if (!user) {
    return <Auth onLogin={setUser} />
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        user={user}
        entries={entries}
        mediaTypes={mediaTypes}
        onLogout={logout}
      />

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          padding: '16px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(9,8,18,.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--text3)', letterSpacing: .5 }}>
            {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} · Scale: {ratingConfig.min}–{ratingConfig.max} · {ratingConfig.precision} decimal{ratingConfig.precision !== 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            Hello, <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{user.name}</span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '32px 32px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/library" replace />} />
            <Route path="/library" element={
              <Library
                entries={entries}
                mediaTypes={mediaTypes}
                ratingConfig={ratingConfig}
                addEntry={addEntry}
                updateEntry={updateEntry}
                deleteEntry={deleteEntry}
              />
            } />
            <Route path="/stats" element={
              <Stats entries={entries} mediaTypes={mediaTypes} ratingConfig={ratingConfig} />
            } />
            <Route path="/settings" element={
              <Settings
                ratingConfig={ratingConfig}
                setRatingConfig={setRatingConfig}
                mediaTypes={mediaTypes}
                setMediaTypes={setMediaTypes}
              />
            } />
            <Route path="*" element={<Navigate to="/library" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
