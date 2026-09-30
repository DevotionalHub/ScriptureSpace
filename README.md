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
5. Add `sixtusonoriode2@gmail.com` as the only admin account. The UI gate and the `visit_logs` RLS select policy both enforce this address.

## Included areas

- Home dashboard with an enlightenment verse, Verse of the day, streak, reading plan, and gentle prompts.
- Bible reader with book navigation and Psalm 23 passage view.
- Searchable verse library and saved verses collection.
- Private reflections editor.
- Community discovery and create-community flow for Bible scholars and readers.
- Restricted admin panel with visit analytics, top pages, community joins, saved verse stats, and recent visits. Visit rows are populated from Supabase when the schema is available, with an intentional demo fallback for an unconfigured database.
