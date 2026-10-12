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

- `index.html` — public marketing landing page with a tilted phone preview of the app, featuring the most popular verse (John 3:16).
- `signup.html` / `login.html` — standalone, responsive passwordless sign-up and log-in pages (Supabase magic link).
- `Communities.html` — public communities directory. Joining a community requires signing up first.
- `app.html` — the full Scripture Space dashboard (home, reader, verse library, communities, saved verses, reflections) built with React.
- `admin.html` — standalone admin workspace restricted to `sixtusonoriode2@gmail.com`; everyone else sees a restricted-access gate. There is no public navigation link to it.

Navigation on the landing page routes "Open the Bible" and "Read Bible" / "Verse library" to `signup.html`, "Find your community" / "Communities" to `Communities.html`, "Log in" to `login.html`, and "Sign up" to `signup.html`.

All public-facing pages share the Deep Navy / Warm Gold / Off White / Soft Gray / Dark Charcoal palette and the supplied logo (also used as the favicon) defined in `public/theme.css`.

## Included areas

- Home dashboard with an enlightenment verse, Verse of the day, streak, reading plan, and gentle prompts.
- Bible reader with book navigation and Psalm 23 passage view.
- Searchable verse library and saved verses collection.
- Private reflections editor.
- Community discovery and create-community flow for Bible scholars and readers.
- Restricted admin workspace (`admin.html`) with visit analytics and recent visitor activity, gated to the single admin account.
