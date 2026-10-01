import { supabase } from './lib/supabase.js'

const form = document.getElementById('signup-form')
const content = document.getElementById('signup-content')
const errorBox = document.getElementById('signup-error')
const submitButton = document.getElementById('signup-submit')

function showError(message) {
  errorBox.textContent = message
  errorBox.style.display = 'block'
}

function hideError() {
  errorBox.style.display = 'none'
}

async function checkExistingSession() {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    window.location.replace('/app.html')
  }
}

checkExistingSession()

form?.addEventListener('submit', async (event) => {
  event.preventDefault()
  hideError()

  const name = document.getElementById('signup-name').value.trim()
  const email = document.getElementById('signup-email').value.trim()

  if (!name || !email) {
    showError('Please enter your name and email address.')
    return
  }

  submitButton.disabled = true
  submitButton.textContent = 'Sending link…'

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/app.html`,
      data: { full_name: name },
    },
  })

  submitButton.disabled = false
  submitButton.textContent = 'Create account →'

  if (error) {
    showError(error.message || 'Unable to send your sign-in link right now. Please try again.')
    return
  }

  content.innerHTML = `
    <div class="form-success">
      <strong>Check your inbox, ${escapeHtml(name)}.</strong><br />
      We sent a secure link to <strong>${escapeHtml(email)}</strong> to finish
      creating your account. Click it to open Scripture Space.
    </div>
  `
})

function escapeHtml(value) {
  const div = document.createElement('div')
  div.textContent = value
  return div.innerHTML
}
