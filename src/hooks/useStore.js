import { useState } from 'react'

export const PRESET_TYPES = [
  { id: 'movies',      name: 'Movies',       icon: '🎬', color: '#fbbf24', preset: true },
  { id: 'tv',          name: 'TV Shows',      icon: '📺', color: '#3b82f6', preset: true },
  { id: 'anime',       name: 'Anime',         icon: '✨', color: '#a78bfa', preset: true },
  { id: 'manga',       name: 'Manga',         icon: '📖', color: '#ec4899', preset: true },
  { id: 'comics',      name: 'Comics',        icon: '💥', color: '#f97316', preset: true },
  { id: 'lightnovels', name: 'Light Novels',  icon: '📚', color: '#10b981', preset: true },
  { id: 'webnovels',   name: 'Web Novels',    icon: '🌐', color: '#06b6d4', preset: true },
  { id: 'books',       name: 'Books',         icon: '📕', color: '#84cc16', preset: true },
  { id: 'games',       name: 'Video Games',   icon: '🎮', color: '#8b5cf6', preset: true },
  { id: 'podcasts',    name: 'Podcasts',      icon: '🎙️', color: '#14b8a6', preset: true },
]

export const STATUSES = ['Completed', 'In Progress', 'Plan to Consume', 'Dropped', 'On Hold']

export const DEFAULT_RATING_CONFIG = { min: 1, max: 10, precision: 1, step: null }

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}

export function useStore() {
  const [user, setUserRaw] = useState(() => load('mv_user', null))
  const [entries, setEntries] = useState(() => load('mv_entries', []))
  const [mediaTypes, setMediaTypesRaw] = useState(() => load('mv_types', PRESET_TYPES))
  const [ratingConfig, setRatingConfigRaw] = useState(() => load('mv_rating', DEFAULT_RATING_CONFIG))

  const persist = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

  const setUser = (u) => { setUserRaw(u); persist('mv_user', u) }
  const setMediaTypes = (v) => { const next = typeof v === 'function' ? v(mediaTypes) : v; setMediaTypesRaw(next); persist('mv_types', next) }
  const setRatingConfig = (v) => { setRatingConfigRaw(v); persist('mv_rating', v) }

  const addEntry = (e) => {
    const next = [{ ...e, id: genId(), createdAt: Date.now() }, ...entries]
    setEntries(next); persist('mv_entries', next)
  }
  const updateEntry = (id, patch) => {
    const next = entries.map(e => e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e)
    setEntries(next); persist('mv_entries', next)
  }
  const deleteEntry = (id) => {
    const next = entries.filter(e => e.id !== id)
    setEntries(next); persist('mv_entries', next)
  }
  const logout = () => {
    setUserRaw(null); localStorage.removeItem('mv_user')
  }

  return { user, setUser, logout, entries, addEntry, updateEntry, deleteEntry, mediaTypes, setMediaTypes, ratingConfig, setRatingConfig }
}

export function formatRating(val, cfg) {
  if (val === null || val === undefined || val === '') return '—'
  const n = parseFloat(val)
  if (isNaN(n)) return '—'
  return `${n.toFixed(cfg.precision)} / ${cfg.max}`
}

export function ratingPercent(val, cfg) {
  if (val === null || val === undefined || val === '') return 0
  const n = parseFloat(val)
  if (isNaN(n)) return 0
  return Math.min(100, Math.max(0, ((n - cfg.min) / (cfg.max - cfg.min)) * 100))
}

export function placeholderGradient(title = '') {
  const hues = [260, 290, 220, 340, 200, 160, 30, 0, 180, 320]
  const h = hues[(title.charCodeAt(0) || 0) % hues.length]
  return `linear-gradient(135deg, hsl(${h},55%,14%) 0%, hsl(${h + 50},45%,22%) 100%)`
}

export function initials(title = '') {
  return title.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?'
}

export const STATUS_COLORS = {
  'Completed':        '#10b981',
  'In Progress':      '#3b82f6',
  'Plan to Consume':  '#6b7280',
  'Dropped':          '#f43f5e',
  'On Hold':          '#fbbf24',
}
