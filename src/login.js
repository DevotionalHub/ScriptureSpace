import { ADMIN_EMAIL, supabase } from './lib/supabase.js'

const form = document.getElementById('login-form')
const content = document.getElementById('login-content')
const errorBox = document.getElementById('login-error')
const submitButton = document.getElementById('login-submit')

function showError(message) {
  errorBox.textContent = message
  errorBox.style.display = 'block'
}

function hideError() {
  errorBox.style.display = 'none'
}

async function checkExistingSession() {
  const { data } = await supabase.auth.getSession()
  const email = data.session?.user?.email?.toLowerCase()
  if (email) {
    window.location.replace(email === ADMIN_EMAIL ? '/admin.html' : '/app.html')
  }
}

checkExistingSession()

form?.addEventListener('submit', async (event) => {
  event.preventDefault()
  hideError()

  const email = document.getElementById('login-email').value.trim()
  if (!email) {
    showError('Please enter your email address.')
    return
  }

  submitButton.disabled = true
  submitButton.textContent = 'Sending link…'

  const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/${isAdminEmail ? 'admin.html' : 'app.html'}`,
    },
  })

  submitButton.disabled = false
  submitButton.textContent = 'Continue with email →'

  if (error) {
    showError(error.message || 'Unable to send your sign-in link right now. Please try again.')
    return
  }

  content.innerHTML = `
    <div class="form-success">
      <strong>Check your inbox.</strong><br />
      We sent a secure sign-in link to <strong>${escapeHtml(email)}</strong>.
      Open it to continue to Scripture Space.
    </div>
  `
})

function escapeHtml(value) {
  const div = document.createElement('div')
  div.textContent = value
  return div.innerHTML
}
