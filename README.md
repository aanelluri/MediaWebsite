# MediaVault

**Your media. Your rules. Your ratings.**

A fully customizable personal media tracking and rating platform. Rate anything at any precision — 3.75/5, 9.33/10, whatever you want. No artificial limits.

## Features

- **Custom Rating System** — set your own min/max/precision. Type 3.75/5 or 8.4/10 exactly as you feel it.
- **10 Preset Media Types** — Movies, TV Shows, Anime, Manga, Comics, Light Novels, Web Novels, Books, Video Games, Podcasts
- **Custom Media Types** — add anything: Stage Plays, Board Games, Video Essays, Podcasts, etc.
- **Upload Your Own Cover Art** — no forced third-party artwork
- **Full Reviews** — no character limit
- **Tags, Progress Tracking, Private Notes**
- **Library Views** — grid and list, with search, filter, and sort
- **Stats Dashboard** — ratings breakdown, top entries, by-type charts
- **JSON Export** — your data is always yours
- **Fully local** — all data saved in your browser's localStorage

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This is a standard Vite + React app. Deploy to:

- **Vercel**: `vercel deploy`
- **Netlify**: drag the `dist/` folder into the Netlify dashboard
- **GitHub Pages**: use the `vite-plugin-gh-pages` plugin
- **Any static host**: run `npm run build` and serve the `dist/` folder

## Tech Stack

- React 18
- React Router v6
- Vite
- 100% vanilla CSS (no UI library dependencies)
- localStorage for persistence

## Adding a Backend

Currently all data is stored in `localStorage`. To add a real backend:

1. Replace the `useStore` hook's `load`/`persist` helpers with API calls
2. Add authentication (the auth flow is already stubbed out in `Auth.jsx`)
3. Connect to any database (PostgreSQL recommended per the PRD)

## Project Structure

```
src/
  components/
    UI.jsx          # Shared components: Btn, Badge, Modal, CoverImage, RatingInput, etc.
    Sidebar.jsx     # Navigation sidebar
    EntryCard.jsx   # Library grid/list card
    EntryForm.jsx   # Add/edit entry form
    EntryDetail.jsx # Entry detail modal
  hooks/
    useStore.js     # All state, localStorage persistence, constants, helpers
  pages/
    Auth.jsx        # Sign in / create account
    Library.jsx     # Main library view
    Stats.jsx       # Statistics dashboard
    Settings.jsx    # Rating config + media type management
  styles/
    global.css      # Design tokens and global styles
  App.jsx           # Root with routing
  main.jsx          # Entry point
```
