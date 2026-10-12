import { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  ArrowRight,
  Bell,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  FileText,
  Flame,
  Globe2,
  Heart,
  Home,
  LayoutDashboard,
  Library,
  Link2,
  LockKeyhole,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  MoveUpRight,
  NotebookPen,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { ADMIN_EMAIL, supabase } from './lib/supabase'
import './styles.css'

const navSections = [
  {
    label: 'Explore',
    items: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'read', label: 'Read Bible', icon: BookOpen },
      { id: 'library', label: 'Verse library', icon: Library },
    ],
  },
  {
    label: 'Your space',
    items: [
      { id: 'communities', label: 'Communities', icon: Users },
      { id: 'bookmarks', label: 'Saved verses', icon: Bookmark },
      { id: 'notes', label: 'My reflections', icon: NotebookPen },
    ],
  },
]

const dailyVerse = {
  reference: 'Psalm 46:10',
  text: 'Be still, and know that I am God.',
  note: 'Stillness is not an empty pause. It is the place where we remember who holds everything together.',
}

const enlightenmentVerse = {
  reference: 'Psalm 145:18',
  text: 'The Lord is near to all who call on him, to all who call on him in truth.',
  note: 'A quiet reminder for the moments when your prayer feels like a whisper.',
}

const readingPlan = [
  { day: 'Day 04', title: 'The practice of trust', book: 'Proverbs 3:1–12', progress: 68 },
  { day: 'Day 05', title: 'A heart made new', book: 'Ezekiel 36:22–32', progress: 0 },
  { day: 'Day 06', title: 'Learning to rest', book: 'Matthew 11:25–30', progress: 0 },
]

const starterCommunities = [
  {
    id: 'scholars-circle',
    name: 'The Scholars’ Circle',
    description: 'Thoughtful study of scripture, context, and the questions that make faith deeper.',
    members: 248,
    color: 'sage',
    initials: 'SC',
    topic: 'Biblical studies',
    active: '12 studying now',
  },
  {
    id: 'women-word',
    name: 'Women in the Word',
    description: 'A warm table for honest questions, faithful friendships, and weekly reflection.',
    members: 184,
    color: 'rose',
    initials: 'WW',
    topic: 'Shared reflection',
    active: '8 studying now',
  },
  {
    id: 'ancient-paths',
    name: 'Ancient Paths',
    description: 'Tracing the story of scripture through history, language, and tradition.',
    members: 97,
    color: 'gold',
    initials: 'AP',
    topic: 'History & context',
    active: '5 studying now',
  },
]

const bibleBooks = [
  { name: 'Genesis', testament: 'Old Testament', chapters: 50, color: 'sage', excerpt: 'In the beginning God created…' },
  { name: 'Psalms', testament: 'Poetry', chapters: 150, color: 'rose', excerpt: 'The Lord is my shepherd…' },
  { name: 'Proverbs', testament: 'Wisdom', chapters: 31, color: 'gold', excerpt: 'Trust in the Lord with all…' },
  { name: 'Matthew', testament: 'New Testament', chapters: 28, color: 'blue', excerpt: 'Blessed are the poor in spirit…' },
  { name: 'John', testament: 'New Testament', chapters: 21, color: 'purple', excerpt: 'In the beginning was the Word…' },
  { name: 'Romans', testament: 'New Testament', chapters: 16, color: 'terracotta', excerpt: 'There is now no condemnation…' },
]

const verseLibrary = [
  { ref: 'Isaiah 41:10', text: 'So do not fear, for I am with you; do not be dismayed, for I am your God.', tag: 'Courage', saved: true },
  { ref: 'Lamentations 3:22–23', text: 'Because of the Lord’s great love we are not consumed, for his compassions never fail. They are new every morning.', tag: 'Hope', saved: true },
  { ref: 'Matthew 6:34', text: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself.', tag: 'Peace', saved: false },
  { ref: 'Romans 12:12', text: 'Be joyful in hope, patient in affliction, faithful in prayer.', tag: 'Practice', saved: false },
  { ref: 'Micah 6:8', text: 'Act justly and to love mercy and to walk humbly with your God.', tag: 'Formation', saved: false },
]

const initialVisitors = [
  { initials: 'AM', name: 'Amina M.', location: 'Lagos, NG', page: 'Verse of the day', time: '2 min ago', tone: 'lavender' },
  { initials: 'JD', name: 'Jonah D.', location: 'Nairobi, KE', page: 'Psalms 23', time: '8 min ago', tone: 'blue' },
  { initials: 'RL', name: 'Ruth L.', location: 'Austin, US', page: 'The Scholars’ Circle', time: '14 min ago', tone: 'peach' },
  { initials: 'MK', name: 'Miriam K.', location: 'London, UK', page: 'Verse library', time: '21 min ago', tone: 'sage' },
  { initials: 'TO', name: 'Theo O.', location: 'Accra, GH', page: 'Genesis 1', time: '32 min ago', tone: 'gold' },
]

const ALLOWED_PAGES = ['home', 'read', 'library', 'communities', 'bookmarks', 'notes']

function getInitialPage() {
  if (typeof window === 'undefined') return 'home'
  const requested = new URLSearchParams(window.location.search).get('page')
  return ALLOWED_PAGES.includes(requested) ? requested : 'home'
}

function App() {
  const [activePage, setActivePage] = useState(getInitialPage)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)
  const [createCommunityOpen, setCreateCommunityOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [savedVerses, setSavedVerses] = useState(['Psalm 46:10', 'Isaiah 41:10', 'Lamentations 3:22–23'])
  const [communities, setCommunities] = useState(starterCommunities)
  const [visitors, setVisitors] = useState(initialVisitors)

  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setCurrentUser(data.session?.user || null)
        setAuthLoading(false)
      }
    }).catch(() => mounted && setAuthLoading(false))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setCurrentUser(session?.user || null)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const visitorId = window.localStorage.getItem('scripture-space-visitor') || crypto.randomUUID()
    window.localStorage.setItem('scripture-space-visitor', visitorId)
    supabase.from('visit_logs').insert({
      visitor_id: visitorId,
      path: window.location.pathname || '/',
      page: 'Home',
      user_agent: navigator.userAgent,
    }).then(({ error }) => {
      if (error) console.info('Visit logging will activate after the visit_logs table is created.')
    }).catch(() => {})
  }, [])

  useEffect(() => {
    supabase.from('communities').select('*').order('created_at', { ascending: false }).limit(12).then(({ data, error }) => {
      if (!error && data?.length) {
        setCommunities(data.map((community, index) => ({
          id: community.id,
          name: community.name,
          description: community.description || 'A welcoming space for thoughtful scripture study.',
          members: community.member_count || 1,
          color: ['sage', 'rose', 'gold', 'blue'][index % 4],
          initials: community.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(),
          topic: community.topic || 'Bible study',
          active: 'New community',
        })))
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    supabase.from('visit_logs').select('*').order('created_at', { ascending: false }).limit(8).then(({ data, error }) => {
      if (!error && data?.length) {
        setVisitors(data.map((visit, index) => ({
          initials: (visit.visitor_id || `V${index}`).slice(0, 2).toUpperCase(),
          name: `Visitor ${String(index + 1).padStart(2, '0')}`,
          location: 'Web visitor',
          page: visit.page || visit.path || 'Home',
          time: formatRelativeTime(visit.created_at),
          tone: ['lavender', 'blue', 'peach', 'sage', 'gold'][index % 5],
        })))
      }
    }).catch(() => {})
  }, [isAdmin])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3200)
  }

  const navigate = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleSaved = (reference) => {
    setSavedVerses((current) => {
      const alreadySaved = current.includes(reference)
      showToast(alreadySaved ? 'Removed from your saved verses.' : 'Saved to your verse library.')
      return alreadySaved ? current.filter((item) => item !== reference) : [...current, reference]
    })
  }

  const copyVerse = async (verse) => {
    try {
      await navigator.clipboard.writeText(`“${verse.text}” — ${verse.reference}`)
      showToast('Verse copied to your clipboard.')
    } catch {
      showToast('Verse ready to share with a friend.')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    showToast('You have been signed out.')
    navigate('home')
  }

  const createCommunity = async (values) => {
    const newCommunity = {
      id: `local-${Date.now()}`,
      name: values.name,
      description: values.description,
      topic: values.topic || 'Bible study',
      members: 1,
      color: 'sage',
      initials: values.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(),
      active: 'Just created',
    }

    const { error } = await supabase.from('communities').insert({
      name: values.name,
      description: values.description,
      topic: values.topic || 'Bible study',
      created_by: currentUser?.id || null,
      member_count: 1,
    })
    setCommunities((current) => [newCommunity, ...current])
    setCreateCommunityOpen(false)
    showToast(error ? 'Community created for this session.' : 'Your community is live.')
  }

  const pageTitle = {
    home: 'Good morning, friend',
    read: 'Read the Bible',
    library: 'Verse library',
    communities: 'Find your people',
    bookmarks: 'Saved verses',
    notes: 'My reflections',
  }[activePage]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup" onClick={() => navigate('home')} role="button" tabIndex="0">
          <div className="brand-mark"><CrossMark /></div>
          <div>
            <div className="brand-name">Scripture<span>Space</span></div>
            <div className="brand-tagline">A quieter place for the Word</div>
          </div>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navSections.map((section) => (
            <div className="nav-section" key={section.label}>
              <div className="nav-label">{section.label}</div>
              {section.items.map(({ id, label, icon: Icon }) => (
                <button className={`nav-item ${activePage === id ? 'active' : ''}`} onClick={() => navigate(id)} key={id}>
                  <Icon size={18} strokeWidth={activePage === id ? 2.2 : 1.8} />
                  <span>{label}</span>
                  {id === 'bookmarks' && savedVerses.length > 0 && <small>{savedVerses.length}</small>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon"><CircleHelp size={17} /></div>
            <div>
              <strong>Need a moment?</strong>
              <span>Try a guided reflection</span>
            </div>
            <ChevronRight size={15} />
          </div>
          {currentUser ? (
            <div className="profile-chip">
              <Avatar name={currentUser.email || 'Reader'} tone="plum" />
              <div className="profile-details"><strong>{currentUser.email === ADMIN_EMAIL ? 'Sixtus Onorio' : 'Your account'}</strong><span>{currentUser.email}</span></div>
              <button className="icon-button subtle" onClick={signOut} aria-label="Sign out"><LogOut size={15} /></button>
            </div>
          ) : (
            <button className="profile-chip sign-in-chip" onClick={() => setAuthOpen(true)}>
              <div className="avatar guest-avatar"><UserRound size={16} /></div>
              <div className="profile-details"><strong>Sign in to save</strong><span>Keep your journey with you</span></div>
              <LogIn size={16} />
            </button>
          )}
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="mobile-brand"><div className="brand-mark small"><CrossMark /></div><span>Scripture<span>Space</span></span></div>
          <div className="topbar-context">
            <span className="context-dot" />
            <span>Wednesday, September 30, 2026</span>
          </div>
          <div className="topbar-actions">
            <label className="top-search">
              <Search size={17} />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && navigate('read')} placeholder="Search scripture..." aria-label="Search scripture" />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => showToast('You are all caught up.') }><Bell size={19} /><span /></button>
            {!currentUser && <button className="top-signin" onClick={() => setAuthOpen(true)}>Sign in <ArrowRight size={15} /></button>}
          </div>
        </header>

        <div className="page-wrap">
          {activePage === 'home' && <HomePage navigate={navigate} toggleSaved={toggleSaved} copyVerse={copyVerse} savedVerses={savedVerses} showToast={showToast} />}
          {activePage === 'read' && <ReadPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} navigate={navigate} />}
          {activePage === 'library' && <LibraryPage savedVerses={savedVerses} toggleSaved={toggleSaved} copyVerse={copyVerse} searchQuery={searchQuery} />}
          {activePage === 'communities' && <CommunitiesPage communities={communities} onCreate={() => setCreateCommunityOpen(true)} navigate={navigate} currentUser={currentUser} showToast={showToast} />}
          {activePage === 'bookmarks' && <BookmarksPage savedVerses={savedVerses} toggleSaved={toggleSaved} copyVerse={copyVerse} navigate={navigate} />}
          {activePage === 'notes' && <NotesPage showToast={showToast} />}
        </div>
      </main>

      <div className="mobile-bottom-nav">
        {navSections[0].items.slice(0, 3).map(({ id, label, icon: Icon }) => <button key={id} className={activePage === id ? 'active' : ''} onClick={() => navigate(id)}><Icon size={19} /><span>{label === 'Read Bible' ? 'Read' : label.split(' ')[0]}</span></button>)}
        <button className={activePage === 'communities' ? 'active' : ''} onClick={() => navigate('communities')}><Users size={19} /><span>People</span></button>
      </div>

      {toast && <div className={`toast ${toast.type}`}><div className="toast-check"><Check size={14} /></div><span>{toast.message}</span></div>}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} showToast={showToast} />}
      {createCommunityOpen && <CreateCommunityModal onClose={() => setCreateCommunityOpen(false)} onCreate={createCommunity} />}
    </div>
  )
}

function HomePage({ navigate, toggleSaved, copyVerse, savedVerses, showToast }) {
  return (
    <div className="page home-page">
      <div className="page-heading home-heading">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> Your daily rhythm</p>
          <h1>{greeting()}, friend <span className="heading-spark">✦</span></h1>
          <p className="page-intro">A little room to breathe, reflect, and return to what matters.</p>
        </div>
        <button className="date-pill"><span className="mini-calendar">30</span><span>Today</span><ChevronDown size={15} /></button>
      </div>

      <section className="welcome-card">
        <div className="welcome-copy">
          <div className="welcome-kicker"><span className="live-dot" /> A gentle beginning</div>
          <h2>Find stillness<br /><em>in the Word.</em></h2>
          <p>Start where you are. Let today’s scripture meet you there.</p>
          <button className="primary-button light" onClick={() => navigate('read')}>Open today’s reading <ArrowRight size={16} /></button>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="sun-disc" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="mountain mountain-back" /><div className="mountain mountain-front" />
          <div className="art-stem stem-one" /><div className="art-leaf leaf-one" /><div className="art-leaf leaf-two" />
          <div className="art-stone stone-one" /><div className="art-stone stone-two" />
        </div>
      </section>

      <div className="home-grid">
        <div className="main-column">
          <section className="section-block">
            <SectionHeader eyebrow="Pause & receive" title="A moment to reflect" action="View library" onAction={() => navigate('library')} />
            <article className="enlightenment-card">
              <div className="card-topline"><span className="soft-badge"><Sparkles size={13} /> Enlightenment verse</span><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div>
              <blockquote>“{enlightenmentVerse.text}”</blockquote>
              <div className="verse-meta"><span>{enlightenmentVerse.reference}</span><span className="meta-divider" /> <span>New International Version</span></div>
              <p className="verse-note">{enlightenmentVerse.note}</p>
              <div className="card-actions"><button className="text-button" onClick={() => copyVerse(enlightenmentVerse)}><Copy size={15} /> Copy verse</button><button className="text-button" onClick={() => toggleSaved(enlightenmentVerse.reference)}>{savedVerses.includes(enlightenmentVerse.reference) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {savedVerses.includes(enlightenmentVerse.reference) ? 'Saved' : 'Save verse'}</button><button className="text-button share-button" onClick={() => showToast('Share link copied.') }><Send size={15} /></button></div>
            </article>
          </section>

          <section className="section-block">
            <SectionHeader eyebrow="Daily anchor" title="Verse of the day" action="See past verses" onAction={() => navigate('library')} />
            <article className="daily-verse-card">
              <div className="daily-verse-number">30<span>SEP</span></div>
              <div className="daily-verse-body"><div className="verse-label">{dailyVerse.reference}</div><blockquote>“{dailyVerse.text}”</blockquote><p>{dailyVerse.note}</p><div className="daily-actions"><button className="outline-button" onClick={() => toggleSaved(dailyVerse.reference)}>{savedVerses.includes(dailyVerse.reference) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {savedVerses.includes(dailyVerse.reference) ? 'Saved' : 'Save verse'}</button><button className="plain-icon-button" onClick={() => copyVerse(dailyVerse)} aria-label="Copy verse"><Copy size={16} /></button><button className="plain-icon-button" onClick={() => showToast('Share link copied.')} aria-label="Share verse"><Link2 size={16} /></button></div></div>
              <div className="daily-illustration"><div className="daily-star star-a">✦</div><div className="daily-star star-b">·</div><div className="daily-moon" /><div className="daily-hill" /><div className="daily-grass grass-a" /><div className="daily-grass grass-b" /></div>
            </article>
          </section>

          <section className="section-block reading-section">
            <SectionHeader eyebrow="Keep going" title="Continue your journey" action="Open reading plan" onAction={() => navigate('read')} />
            <div className="reading-list">{readingPlan.map((item, index) => <button className={`reading-row ${index === 0 ? 'current' : ''}`} key={item.day} onClick={() => navigate('read')}><div className={`reading-index ${index === 0 ? 'filled' : ''}`}>{index === 0 ? <BookOpen size={15} /> : String(index + 1).padStart(2, '0')}</div><div className="reading-details"><span className="reading-day">{item.day}{index === 0 && <span className="now-chip">In progress</span>}</span><strong>{item.title}</strong><small>{item.book}</small></div><div className="reading-progress"><div className="progress-track"><span style={{ width: `${item.progress}%` }} /></div><span>{item.progress ? `${item.progress}%` : 'Begin'}</span></div><ChevronRight size={17} className="row-arrow" /></button>)}</div>
          </section>
        </div>

        <aside className="home-aside">
          <section className="rhythm-card side-card"><div className="side-card-heading"><div><p className="eyebrow">Your rhythm</p><h3>Small steps,<br /><em>steady heart.</em></h3></div><div className="flame-mark"><Flame size={18} /></div></div><div className="streak-number">04 <span>days</span></div><p className="side-muted">You’ve made space for scripture<br />four days in a row.</p><div className="week-dots">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <div key={`${day}-${index}`} className={`day-dot ${index < 4 ? 'done' : index === 4 ? 'today' : ''}`}><span>{day}</span><i>{index < 4 ? '✓' : ''}</i></div>)}</div><button className="side-link" onClick={() => navigate('read')}>View your progress <ArrowRight size={15} /></button></section>
          <section className="quote-card side-card"><div className="quote-mark">“</div><p>Faith is taking the first step even when you don’t see the whole staircase.</p><span>— Martin Luther King Jr.</span><div className="quote-footer"><span><Heart size={14} fill="currentColor" /> 128 found this helpful</span><button aria-label="Save quote" onClick={() => showToast('Quote saved to your reflections.')}><Bookmark size={15} /></button></div></section>
          <section className="community-mini side-card"><div className="side-card-heading"><div><p className="eyebrow">Around the table</p><h3>Study with<br /><em>good people.</em></h3></div><div className="mini-avatars"><Avatar name="Amina" tone="peach" /><Avatar name="Ruth" tone="blue" /><Avatar name="Jonah" tone="gold" /><span>+12</span></div></div><p className="side-muted">Join a thoughtful conversation about scripture and life.</p><button className="outline-button full" onClick={() => navigate('communities')}>Explore communities <ArrowRight size={15} /></button></section>
        </aside>
      </div>
    </div>
  )
}

function ReadPage({ searchQuery, setSearchQuery, navigate }) {
  const [selectedBook, setSelectedBook] = useState('Psalms')
  const [chapter, setChapter] = useState(23)
  return <div className="page inner-page"><div className="page-heading"><div><p className="eyebrow"><BookOpen size={14} /> Scripture reader</p><h1>Read the Bible</h1><p className="page-intro">Take your time. There’s no need to rush sacred words.</p></div><button className="outline-button"><Bookmark size={15} /> Reading plan</button></div><div className="reader-toolbar"><div className="reader-search"><Search size={17} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search a verse, book, or phrase" /><kbd>⌘ K</kbd></div><div className="version-select">NIV <ChevronDown size={15} /></div></div><div className="reader-layout"><aside className="book-list"><div className="book-list-heading"><strong>Books</strong><span>66 total</span></div><div className="book-tabs"><button className="active">All</button><button>Old</button><button>New</button></div>{bibleBooks.map((book) => <button key={book.name} className={`book-list-row ${selectedBook === book.name ? 'active' : ''}`} onClick={() => setSelectedBook(book.name)}><span className={`book-color ${book.color}`} /><span>{book.name}</span><small>{book.chapters}</small></button>)}</aside><article className="passage-card"><div className="passage-top"><div><span className="eyebrow">{selectedBook} · Poetry</span><div className="chapter-title"><button onClick={() => setChapter((value) => Math.max(1, value - 1))}><ChevronRight size={17} className="rotate-left" /></button><h2>{chapter}</h2><button onClick={() => setChapter((value) => value + 1)}><ChevronRight size={17} /></button></div></div><button className="plain-icon-button"><MoreHorizontal size={18} /></button></div><div className="passage-content"><p className="drop-cap">T</p><p>he Lord is my shepherd, I lack nothing.<sup>1</sup></p><p>He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.</p><p>He guides me along the right paths for his name’s sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.</p><p>You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.</p><p>Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.</p></div><div className="passage-footer"><span>Psalm 23 · New International Version</span><div><button className="text-button"><NotebookPen size={15} /> Add reflection</button><button className="text-button"><Bookmark size={15} /> Save passage</button></div></div></article></div><div className="reader-tip"><Sparkles size={16} /><span><strong>Reading tip:</strong> Read the passage once for meaning, then once for what it stirs in you.</span><button onClick={() => navigate('notes')}>Write a reflection <ArrowRight size={14} /></button></div></div>
}

function LibraryPage({ savedVerses, toggleSaved, copyVerse, searchQuery }) {
  const filtered = verseLibrary.filter((verse) => `${verse.ref} ${verse.text} ${verse.tag}`.toLowerCase().includes(searchQuery.toLowerCase()))
  return <div className="page inner-page"><div className="page-heading"><div><p className="eyebrow"><Library size={14} /> Your collection</p><h1>Verse library</h1><p className="page-intro">Words to return to, organized by the seasons you’re walking through.</p></div><button className="primary-button" onClick={() => document.querySelector('.library-search input')?.focus()}><Plus size={16} /> Add a verse</button></div><div className="library-controls"><div className="library-search"><Search size={17} /><input placeholder="Search your library" defaultValue={searchQuery} /><kbd>⌘ K</kbd></div><div className="filter-pills"><button className="active">All verses</button><button>Hope</button><button>Courage</button><button>Peace</button></div></div><div className="library-grid">{filtered.map((verse) => <article className="library-verse" key={verse.ref}><div className="library-verse-head"><span className="topic-tag">{verse.tag}</span><button className="plain-icon-button" onClick={() => toggleSaved(verse.ref)} aria-label="Save verse">{savedVerses.includes(verse.ref) ? <BookmarkCheck size={17} fill="currentColor" /> : <Bookmark size={17} />}</button></div><blockquote>“{verse.text}”</blockquote><div className="library-verse-footer"><strong>{verse.ref}</strong><button className="plain-icon-button" onClick={() => copyVerse({ reference: verse.ref, text: verse.text })} aria-label="Copy verse"><Copy size={15} /></button></div></article>)}{filtered.length === 0 && <div className="empty-state"><Search size={23} /><h3>No verses found</h3><p>Try searching for a different word or reference.</p></div>}</div><div className="collection-note"><div className="note-scribble"><NotebookPen size={19} /></div><div><strong>Make it yours</strong><p>Add a personal note to any saved verse. Your reflections are private unless you choose to share them.</p></div><ArrowRight size={17} /></div></div>
}

function CommunitiesPage({ communities, onCreate, navigate, currentUser, showToast }) {
  return <div className="page inner-page communities-page"><div className="page-heading"><div><p className="eyebrow"><Users size={14} /> Learn together</p><h1>Find your people</h1><p className="page-intro">Faith grows in good company. Gather around questions that matter.</p></div><button className="primary-button" onClick={onCreate}><Plus size={16} /> Create a community</button></div><section className="community-hero"><div><span className="soft-badge"><Globe2 size={13} /> A global table</span><h2>There’s room<br />for your questions.</h2><p>Whether you’re studying Greek, reading through a Gospel, or simply trying to live out what you believe — you belong here.</p><button className="light-link" onClick={() => showToast('Showing communities near you soon.')}><span>How communities work</span><ArrowRight size={15} /></button></div><div className="community-hero-art"><div className="table-circle" /><div className="person person-a">A</div><div className="person person-b">R</div><div className="person person-c">J</div><div className="person person-d">M</div><div className="paper-note">bring<br /><em>your wonder</em></div></div></section><div className="community-section-heading"><div><p className="eyebrow">Open doors</p><h2>Communities to explore</h2></div><div className="community-sort">Most active <ChevronDown size={14} /></div></div><div className="community-grid">{communities.map((community) => <CommunityCard key={community.id} community={community} onClick={() => showToast(`Welcome to ${community.name}.`)} />)}<button className="new-community-card" onClick={onCreate}><div className="new-community-icon"><Plus size={20} /></div><strong>Start something meaningful</strong><span>Create a space for your study, questions, and people.</span></button></div><div className="community-guidelines"><ShieldCheck size={19} /><div><strong>A kind, curious corner of the internet</strong><p>We listen generously, ask honest questions, and leave room for one another’s stories.</p></div><button className="text-button" onClick={() => showToast('Community guidelines opened.')}>Read guidelines <ArrowRight size={14} /></button></div></div>
}

function CommunityCard({ community, onClick }) {
  return <article className="community-card"><div className={`community-art ${community.color}`}><div className="community-lines" /><span>{community.initials}</span><div className="member-stack"><Avatar name="Amina" tone="peach" /><Avatar name="Ruth" tone="blue" /><span>+{Math.max(community.members - 2, 1)}</span></div></div><div className="community-card-body"><div className="community-card-topic">{community.topic}<span>·</span><span className="active-dot" /> {community.active}</div><h3>{community.name}</h3><p>{community.description}</p><div className="community-card-footer"><span><Users size={14} /> {community.members} members</span><button className="circle-arrow" onClick={onClick} aria-label={`Open ${community.name}`}><ArrowRight size={16} /></button></div></div></article>
}

function BookmarksPage({ savedVerses, toggleSaved, copyVerse, navigate }) {
  const items = verseLibrary.filter((verse) => savedVerses.includes(verse.ref)).concat(savedVerses.filter((ref) => !verseLibrary.some((verse) => verse.ref === ref)).map((ref) => ({ ref, text: ref === 'Psalm 46:10' ? dailyVerse.text : enlightenmentVerse.text, tag: 'Saved' })))
  return <div className="page inner-page"><div className="page-heading"><div><p className="eyebrow"><BookmarkCheck size={14} /> Your quiet collection</p><h1>Saved verses</h1><p className="page-intro">The words you’ve chosen to carry with you.</p></div><div className="saved-count"><strong>{items.length}</strong><span>verses<br />saved</span></div></div>{items.length ? <div className="saved-list">{items.map((verse) => <article className="saved-row" key={verse.ref}><div className="saved-symbol"><BookmarkCheck size={16} /></div><div className="saved-copy"><span>{verse.tag}</span><blockquote>“{verse.text}”</blockquote><strong>{verse.ref}</strong></div><div className="saved-actions"><button className="plain-icon-button" onClick={() => copyVerse({ reference: verse.ref, text: verse.text })}><Copy size={16} /></button><button className="plain-icon-button" onClick={() => toggleSaved(verse.ref)}><BookmarkCheck size={17} /></button><ChevronRight size={17} /></div></article>)}</div> : <div className="empty-state large"><Bookmark size={28} /><h3>Your saved verses will live here</h3><p>When a verse meets you in a meaningful way, save it for the road ahead.</p><button className="primary-button" onClick={() => navigate('library')}>Explore the library <ArrowRight size={16} /></button></div>}<div className="saved-footer"><Sparkles size={17} /><span>“I have hidden your word in my heart…” <strong>Psalm 119:11</strong></span></div></div>
}

function NotesPage({ showToast }) {
  const [note, setNote] = useState('What is this passage inviting me to release today?')
  return <div className="page inner-page notes-page"><div className="page-heading"><div><p className="eyebrow"><NotebookPen size={14} /> Private by default</p><h1>My reflections</h1><p className="page-intro">A place to be honest with God and yourself.</p></div><button className="primary-button" onClick={() => showToast('Reflection saved.')}>Save reflection <Check size={16} /></button></div><div className="notes-layout"><aside className="notes-sidebar"><div className="notes-sidebar-heading"><strong>Recent reflections</strong><button className="plain-icon-button"><Plus size={17} /></button></div><button className="note-list-item active"><span>Today</span><strong>Making room for stillness</strong><small>Just now</small></button><button className="note-list-item"><span>Sep 28</span><strong>On becoming more patient</strong><small>2 days ago</small></button><button className="note-list-item"><span>Sep 24</span><strong>A prayer for home</strong><small>6 days ago</small></button><div className="notes-private"><LockKeyhole size={15} /><span>Your reflections are private<br />to you.</span></div></aside><article className="reflection-editor"><div className="reflection-editor-top"><span className="soft-badge">Today · September 30</span><button className="plain-icon-button"><MoreHorizontal size={18} /></button></div><input className="reflection-title" defaultValue="Making room for stillness" aria-label="Reflection title" /><div className="reflection-passage"><BookOpen size={15} /><span>Psalm 46:10</span><span className="meta-divider" /><em>“Be still, and know that I am God.”</em></div><textarea value={note} onChange={(event) => setNote(event.target.value)} aria-label="Reflection text" /><div className="editor-footer"><span><Clock3 size={14} /> Saved just now</span><span>{note.length} characters</span></div></article></div></div>
}

function AdminPage({ isAdmin, currentUser, openAuth, visitors, setVisitors, showToast }) {
  const [range, setRange] = useState('Last 7 days')
  if (!isAdmin) return <div className="page inner-page admin-page"><div className="page-heading"><div><p className="eyebrow"><ShieldCheck size={14} /> Restricted workspace</p><h1>Admin panel</h1><p className="page-intro">A private view of how Scripture Space is being used.</p></div><span className="restricted-pill"><LockKeyhole size={13} /> Admin only</span></div><div className="admin-gate"><div className="admin-lock"><ShieldCheck size={30} /></div><h2>This space is for the steward.</h2><p>Admin access is limited to the authorized account. Sign in with <strong>{ADMIN_EMAIL}</strong> to continue.</p>{currentUser ? <div className="gate-note"><CircleHelp size={16} /> You’re signed in as {currentUser.email}, which doesn’t have admin access.</div> : <button className="primary-button" onClick={openAuth}><LogIn size={16} /> Sign in as admin</button>}<span className="admin-security-note"><LockKeyhole size={13} /> Access is checked against your Supabase account</span></div></div>
  const total = 1248
  const newVisitors = 286
  return <div className="page inner-page admin-page"><div className="page-heading"><div><p className="eyebrow"><ShieldCheck size={14} /> Authorized workspace</p><h1>Good morning, Sixtus <span className="heading-spark">✦</span></h1><p className="page-intro">Here’s how the Scripture Space community is showing up.</p></div><div className="admin-heading-actions"><span className="admin-user-pill"><span className="admin-online" /> {ADMIN_EMAIL}</span><button className="outline-button"><Settings size={15} /> Settings</button></div></div><div className="admin-stats"><AdminStat label="Total visits" value={total.toLocaleString()} change="18.4%" trend="up" icon={Globe2} /><AdminStat label="New visitors" value={newVisitors.toLocaleString()} change="12.8%" trend="up" icon={Users} /><AdminStat label="Community joins" value="84" change="6.2%" trend="up" icon={Heart} /><AdminStat label="Verses saved" value="392" change="24.1%" trend="up" icon={BookmarkCheck} /></div><div className="admin-grid"><section className="analytics-card"><div className="analytics-header"><div><p className="eyebrow">Audience overview</p><h2>Visits over time</h2></div><div className="range-select">{range}<ChevronDown size={14} /></div></div><div className="analytics-total"><strong>1,248</strong><span><i>+18.4%</i> vs previous period</span></div><div className="chart"><div className="chart-y"><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div><div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /><i /><i /></div><svg className="chart-line" viewBox="0 0 690 215" preserveAspectRatio="none" aria-label="Visits trending upward"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8eaa91" stopOpacity=".3" /><stop offset="100%" stopColor="#8eaa91" stopOpacity="0" /></linearGradient></defs><path d="M0,174 C32,162 43,169 67,145 S106,154 130,132 S170,125 195,140 S226,100 254,116 S287,101 319,110 S351,64 382,86 S415,98 445,70 S480,79 509,55 S542,62 568,43 S607,50 628,22 S662,30 690,10 L690,215 L0,215 Z" fill="url(#chartFill)" /><path d="M0,174 C32,162 43,169 67,145 S106,154 130,132 S170,125 195,140 S226,100 254,116 S287,101 319,110 S351,64 382,86 S415,98 445,70 S480,79 509,55 S542,62 568,43 S607,50 628,22 S662,30 690,10" fill="none" stroke="#6f9175" strokeWidth="3" strokeLinecap="round" /></svg><div className="chart-x"><span>Sep 24</span><span>Sep 25</span><span>Sep 26</span><span>Sep 27</span><span>Sep 28</span><span>Sep 29</span><span>Sep 30</span></div></div></div><div className="chart-legend"><span><i className="legend-dot" /> Visits</span><button onClick={() => setRange(range === 'Last 7 days' ? 'Last 30 days' : 'Last 7 days')}>{range}<ChevronDown size={13} /></button></div></section><section className="traffic-card"><div className="analytics-header"><div><p className="eyebrow">Where they find you</p><h2>Top pages</h2></div><button className="plain-icon-button"><MoreHorizontal size={18} /></button></div><div className="top-pages"><TopPage label="Home" value="42.8%" width="78%" count="534" /><TopPage label="Verse of the day" value="24.1%" width="57%" count="301" /><TopPage label="Communities" value="17.6%" width="42%" count="220" /><TopPage label="Read Bible" value="10.3%" width="29%" count="129" /></div><button className="text-button all-pages">View all pages <ArrowRight size={14} /></button></section></div><section className="visitors-card"><div className="visitors-header"><div><p className="eyebrow">Live activity</p><h2>Recent visits</h2></div><div className="visitor-header-right"><span className="live-status"><i /> Live</span><button className="outline-button compact"><MoreHorizontal size={16} /></button></div></div><div className="visitors-table"><div className="visitor-table-head"><span>Visitor</span><span>Page</span><span>Location</span><span>When</span><span /></div>{visitors.map((visitor, index) => <div className="visitor-row" key={`${visitor.name}-${index}`}><div className="visitor-name"><Avatar name={visitor.name} tone={visitor.tone} /><div><strong>{visitor.name}</strong><small>Visitor #{String(1248 - index).padStart(4, '0')}</small></div></div><span className="visitor-page">{visitor.page}</span><span className="visitor-location">{visitor.location}</span><span className="visitor-time">{visitor.time}</span><button className="plain-icon-button" aria-label="More visitor actions"><MoreHorizontal size={17} /></button></div>)}</div><button className="view-all-visitors" onClick={() => { setVisitors(initialVisitors); showToast('Showing the latest visitor activity.') }}>View all activity <ArrowRight size={15} /></button></section></div>
}

function AdminStat({ label, value, change, icon: Icon }) {
  return <div className="admin-stat"><div className="stat-icon"><Icon size={17} /></div><span className="stat-label">{label}</span><strong>{value}</strong><span className="stat-change"><ArrowRight size={12} /> {change}</span><span className="stat-period">vs last week</span></div>
}

function TopPage({ label, value, width, count }) { return <div className="top-page"><div><span>{label}</span><strong>{count}</strong></div><div className="page-bar"><i style={{ width }} /></div><span className="page-percent">{value}</span></div> }

function AuthModal({ onClose, showToast }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSending(true)
    const { error: authError } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin } })
    setSending(false)
    if (authError) {
      setError(authError.message || 'Unable to send your sign-in link right now.')
      return
    }
    setSent(true)
    showToast('Check your inbox for a secure sign-in link.')
  }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal auth-modal"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><div className="modal-logo"><div className="brand-mark"><CrossMark /></div></div>{sent ? <><p className="eyebrow centered"><Check size={14} /> Link sent</p><h2>Check your inbox.</h2><p className="modal-copy">We sent a secure sign-in link to <strong>{email}</strong>. This window can stay open while you check.</p><button className="outline-button full" onClick={() => setSent(false)}>Use a different email</button></> : <><p className="eyebrow centered">Welcome back</p><h2>Keep your place.</h2><p className="modal-copy">Sign in to save verses, keep reflections private, and find your communities anywhere.</p><form onSubmit={submit}><label className="field-label">Email address<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoFocus /></label>{error && <div className="form-error">{error}</div>}<button className="primary-button full" disabled={sending}>{sending ? 'Sending link…' : 'Continue with email'} <ArrowRight size={16} /></button></form><p className="auth-footnote"><LockKeyhole size={13} /> Passwordless and secure through Supabase</p></>}</div></div>
}

function CreateCommunityModal({ onClose, onCreate }) {
  const [values, setValues] = useState({ name: '', topic: '', description: '' })
  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }))
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal create-modal"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><div className="create-modal-icon"><Users size={21} /></div><p className="eyebrow">Make room at the table</p><h2>Create a community</h2><p className="modal-copy">Give your corner of the Bible world a name and an invitation.</p><form onSubmit={(event) => { event.preventDefault(); onCreate(values) }}><label className="field-label">Community name<input required value={values.name} onChange={update('name')} placeholder="e.g. The Gospel of Mark study" /></label><label className="field-label">What will you explore?<input value={values.topic} onChange={update('topic')} placeholder="e.g. Biblical context, prayer, Greek" /></label><label className="field-label">A short invitation<textarea required value={values.description} onChange={update('description')} placeholder="Tell people what they can expect…" rows="3" /></label><div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Create community <ArrowRight size={15} /></button></div></form></div></div>
}

function SectionHeader({ eyebrow, title, action, onAction }) { return <div className="section-header"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action && <button className="section-action" onClick={onAction}>{action} <ArrowRight size={14} /></button>}</div> }

function Avatar({ name, tone = 'sage' }) { return <div className={`avatar ${tone}`} aria-label={name}>{name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div> }
function CrossMark() { return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M13.9 3.4v9.4H4.6v2.5h9.3v9.3h2.6v-9.3h6.9c.5-1 .8-1.7 1-2.5h-7.9V3.4h-2.6Z" fill="currentColor" /></svg> }
function greeting() { const hour = new Date().getHours(); return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening' }
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

export default App
