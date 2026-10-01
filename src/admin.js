import { ADMIN_EMAIL, supabase } from './lib/supabase.js'

const root = document.getElementById('admin-root')
const headerActions = document.getElementById('admin-header-actions')

function renderGate(currentUser) {
  headerActions.innerHTML = `<a class="login-link" href="/login.html">Log in</a>`

  root.innerHTML = `
    <div class="admin-gate-card">
      <div class="gate-icon">🔒</div>
      <h2>This space is for the steward.</h2>
      <p>
        Admin access is limited to the authorized account.
        ${
          currentUser
            ? `You're signed in as <strong>${escapeHtml(currentUser.email)}</strong>, which doesn't have admin access.`
            : `Sign in with <strong>${ADMIN_EMAIL}</strong> to continue.`
        }
      </p>
      <a class="form-submit" style="display:inline-flex; width:auto; padding:12px 24px; text-decoration:none;" href="/login.html">
        Sign in as admin →
      </a>
    </div>
  `
}

function escapeHtml(value) {
  const div = document.createElement('div')
  div.textContent = value ?? ''
  return div.innerHTML
}

function formatRelativeTime(value) {
  if (!value) return 'Just now'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  return `${Math.floor(hours / 24)} days ago`
}

async function renderDashboard(currentUser) {
  headerActions.innerHTML = `<button class="admin-signout" id="admin-signout">Sign out</button>`
  document.getElementById('admin-signout').addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  })

  root.innerHTML = `
    <section class="page-hero" style="padding-top:24px; margin-bottom:28px;">
      <div class="eyebrow"><span class="eyebrow-mark">✦</span> Authorized workspace</div>
      <h1 style="font-size:clamp(28px,3.6vw,42px);">Good morning, Sixtus</h1>
      <p>Here's how the Scripture Space community is showing up, ${escapeHtml(currentUser.email)}.</p>
    </section>

    <div class="admin-stats-row" id="admin-stats">
      <div class="admin-stat-card"><span>Total visits</span><strong>—</strong></div>
      <div class="admin-stat-card"><span>Communities</span><strong>—</strong></div>
      <div class="admin-stat-card"><span>New visitors (24h)</span><strong>—</strong></div>
      <div class="admin-stat-card"><span>Verses saved (demo)</span><strong>392</strong></div>
    </div>

    <div class="admin-table">
      <div class="admin-table-head">
        <span>Visitor</span><span>Page</span><span>When</span><span>Path</span>
      </div>
      <div id="admin-visitor-rows">
        <div class="admin-table-row"><span colspan="4">Loading recent activity…</span></div>
      </div>
    </div>
  `

  const statsCards = document.querySelectorAll('#admin-stats strong')

  const [{ count: totalVisits }, { count: communityCount }, { data: recentVisits }] = await Promise.all([
    supabase.from('visit_logs').select('*', { count: 'exact', head: true }),
    supabase.from('communities').select('*', { count: 'exact', head: true }),
    supabase.from('visit_logs').select('*').order('created_at', { ascending: false }).limit(8),
  ])

  statsCards[0].textContent = (totalVisits ?? 0).toLocaleString()
  statsCards[1].textContent = (communityCount ?? 0).toLocaleString()

  const since = Date.now() - 24 * 60 * 60 * 1000
  const newVisitors = (recentVisits || []).filter((v) => new Date(v.created_at).getTime() > since).length
  statsCards[2].textContent = newVisitors.toLocaleString()

  const rowsContainer = document.getElementById('admin-visitor-rows')
  if (recentVisits?.length) {
    rowsContainer.innerHTML = recentVisits
      .map(
        (visit, index) => `
        <div class="admin-table-row">
          <span>Visitor ${String(index + 1).padStart(2, '0')}</span>
          <span>${escapeHtml(visit.page || 'Home')}</span>
          <span>${formatRelativeTime(visit.created_at)}</span>
          <span>${escapeHtml(visit.path || '/')}</span>
        </div>
      `
      )
      .join('')
  } else {
    rowsContainer.innerHTML = `<div class="admin-table-row"><span>No activity logged yet.</span></div>`
  }
}

async function init() {
  const { data } = await supabase.auth.getSession()
  const currentUser = data.session?.user || null
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL

  if (isAdmin) {
    renderDashboard(currentUser)
  } else {
    renderGate(currentUser)
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user || null
    const admin = user?.email?.toLowerCase() === ADMIN_EMAIL
    if (admin) {
      renderDashboard(user)
    } else {
      renderGate(user)
    }
  })
}

init()
