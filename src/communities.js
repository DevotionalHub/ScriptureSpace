import { supabase } from './lib/supabase.js'

const starterCommunities = [
  {
    id: 'scholars-circle',
    name: 'The Scholars’ Circle',
    description: 'Thoughtful study of scripture, context, and the questions that make faith deeper.',
    members: 248,
    initials: 'SC',
    topic: 'Biblical studies',
    active: '12 studying now',
  },
  {
    id: 'women-word',
    name: 'Women in the Word',
    description: 'A warm table for honest questions, faithful friendships, and weekly reflection.',
    members: 184,
    initials: 'WW',
    topic: 'Shared reflection',
    active: '8 studying now',
  },
  {
    id: 'ancient-paths',
    name: 'Ancient Paths',
    description: 'Tracing the story of scripture through history, language, and tradition.',
    members: 97,
    initials: 'AP',
    topic: 'History & context',
    active: '5 studying now',
  },
]

const grid = document.getElementById('community-grid')

function escapeHtml(value) {
  const div = document.createElement('div')
  div.textContent = value ?? ''
  return div.innerHTML
}

function renderCommunities(communities) {
  grid.innerHTML = communities
    .map(
      (community) => `
      <article class="community-card">
        <div class="community-card-top">
          <div class="community-badge">${escapeHtml(community.initials)}</div>
          <div class="community-active"><i></i> ${escapeHtml(community.active)}</div>
        </div>
        <h3>${escapeHtml(community.name)}</h3>
        <p>${escapeHtml(community.description)}</p>
        <div class="community-card-footer">
          <span>${escapeHtml(community.topic)} · ${community.members} members</span>
          <button class="community-join" data-name="${escapeHtml(community.name)}">Join →</button>
        </div>
      </article>
    `
    )
    .join('')

  grid.querySelectorAll('.community-join').forEach((button) => {
    button.addEventListener('click', () => handleJoin(button))
  })
}

async function handleJoin(button) {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    window.location.href = '/signup.html'
    return
  }
  button.textContent = 'Joined ✓'
  button.disabled = true
}

async function loadCommunities() {
  renderCommunities(starterCommunities)

  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12)

    if (!error && data?.length) {
      const live = data.map((community) => ({
        id: community.id,
        name: community.name,
        description: community.description || 'A welcoming space for thoughtful scripture study.',
        members: community.member_count || 1,
        initials: community.name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        topic: community.topic || 'Bible study',
        active: 'New community',
      }))
      renderCommunities([...live, ...starterCommunities])
    }
  } catch {
    // Keep the starter communities visible if Supabase isn't reachable.
  }
}

loadCommunities()
