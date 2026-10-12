# Scripture Space

A calm, responsive Bible web app for daily scripture, reflection, and thoughtful community. It is built with React + Vite and uses the supplied Supabase project for passwordless sign-in, communities, visit logging, saved verses, and private reflections.

## Run locally

```bash
npm install
npm run dev
```

The app has safe browser-side fallbacks, so the UI still works before the database schema is applied.

## Supabase setup

1. In the Supabase dashboard for `yjefiadfhdqnxlnxycul.supabase.co`, open **SQL Editor**.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) to create the tables and row-level security policies.
3. Copy `.env.example` to `.env` if you want to override the supplied project values:

```bash
VITE_SUPABASE_URL=https://yjefiadfhdqnxlnxycul.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key_here
```

4. In Supabase **Authentication → URL Configuration**, add your local URL and deployed URL to the redirect allow list. Sign-in is passwordless and sends a magic link.
5. Add `sixtusonoriode2@gmail.com` as the only admin account. The `admin.html` gate and the `visit_logs` RLS select policy both enforce this address.

## Pages

- `index.html` — the Scripture Space home surface, built to the brand design system. It renders one responsive page at every size and carries a dark / light theme switch:
  - **Phone (375–430px)** — compact app bar with the SS mark, wordmark and a minimal theme button; the greeting "Good morning, you're in your quiet place."; a Verse of the Day card (Psalm 46:10) over a mountain landscape; a Continue Reading card (John, Chapter 3); Daily Reflection; and a fixed bottom navigation (Home, Read, Discover, Saved, Profile).
  - **Laptop (1024–1440px)** — full horizontal navigation (logo, Home, Read, Discover, Plans, search, theme toggle, profile); a hero banner headed **"A Little Space for the Word."** over a still-life Bible scene with the Explore the Bible button; Verse of the Day beside a reading-progress card; then three feature cards — Start a Reading Plan, Daily Reflection, Your Saved Verses.
  - **Desktop (1440px+)** — a wider hero banner of sunrise peaks headed **"God's Word for Every Season."** with the subtitle *Same truth. New day. Deeper you.*; a sticky **Your Journey** sidebar (reading streak, completed chapters, current plan, progress); and three large feature cards — Explore Scripture, Daily Reflection, Your Saved Verses.
- `signup.html` / `login.html` — standalone, responsive passwordless sign-up and log-in pages (Supabase magic link).
- `Communities.html` — public communities directory. Joining a community requires signing up first.
- `app.html` — the full Scripture Space dashboard (home, reader, verse library, communities, saved verses, reflections) built with React.
- `admin.html` — standalone admin workspace restricted to `sixtusonoriode2@gmail.com`; everyone else sees a restricted-access gate. There is no public navigation link to it.

Navigation on the landing page routes "Explore the Bible", "Read", "Plans" and the Saved tab to `app.html`, "Find your community" / "Discover" to `Communities.html`, "Log in" to `login.html`, and "Create your space" to `signup.html`.

## Design system

`public/scripture-space.css` holds the brand design system used by `index.html`. Dark and light modes share one structure — only the colour tokens change, driven by `data-theme` on `<html>` and persisted to `localStorage` (defaulting to the visitor's `prefers-color-scheme`).

| Token     | Dark                | Light               |
| --------- | ------------------- | ------------------- |
| Background| `#10131C`           | `#F8F7F3`           |
| Card      | `#1B2030`           | `#FFFFFF`           |
| Accent    | `#A7C4A0`           | `#344E41`           |
| Gold      | `#E1BD73`           | `#C5A15B`           |
| Text      | `#F4F2EC`           | `#20251F`           |
| Muted     | `#A4A9B5`           | `#73776F`           |

Headings are set in Fraunces (an elegant serif) and body copy in Inter, both with system fallbacks so the page still reads well without the webfont. Breakpoints are mobile-first at 680 / 900 / 1040 / 1280 / 1440px.

The older public pages still share the Deep Navy / Warm Gold palette and the supplied logo (also used as the favicon) defined in `public/theme.css`.

## Included areas

- Home dashboard with an enlightenment verse, Verse of the day, streak, reading plan, and gentle prompts.
- Bible reader with book navigation and Psalm 23 passage view.
- Searchable verse library and saved verses collection.
- Private reflections editor.
- Community discovery and create-community flow for Bible scholars and readers.
- Restricted admin workspace (`admin.html`) with visit analytics and recent visitor activity, gated to the single admin account.
