import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useSession } from '../context/useSession'
import { dashboardForRole } from '../routes/roleRoutes'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ProfileFormPage() {
  const { session, role, updateUser } = useSession()
  const [form, setForm] = useState({
    name: session?.user.name ?? 'Aarav Mehta',
    email: session?.user.email ?? 'aarav@gmail.com',
    phone: session?.user.phone ?? '+91 9876543210',
    bio: session?.user.bio ?? 'Textile artisan from Gujarat',
  })
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState('')

  const updateField = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
    setFeedback('')
  }

  const handleSubmit = event => {
    event.preventDefault()
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Enter a name with at least 2 characters.'
    if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!/^\+?[0-9\s()-]+$/.test(form.phone.trim()) || form.phone.replace(/\D/g, '').length < 7) nextErrors.phone = 'Enter a valid phone number.'
    if (form.bio.trim().length < 10) nextErrors.bio = 'Add a short bio of at least 10 characters.'
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const savedToSession = updateUser({ ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), bio: form.bio.trim() })
    setFeedback(savedToSession
      ? 'Profile updated in this browser.'
      : 'Profile preview updated on this page. Sign in to save your changes.')
  }

  return (
    <Layout>
      <main id="main-content" className="page-auth">
        <div className="container container--narrow">
          <p className="back"><Link to={dashboardForRole(role)}>← Dashboard</Link></p>
          <h1>Edit Profile</h1>
          <p className="muted">Update your profile details. Signed in as {session.user.name} ({role}). Changes are saved in this browser.</p>
          <div className="auth-card">
            <form className="form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="profile-name">Name</label>
              <input id="profile-name" name="name" value={form.name} onChange={updateField} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'profile-name-error' : undefined} required />
              {errors.name && <p className="field-error" id="profile-name-error" role="alert">{errors.name}</p>}
              <label htmlFor="profile-email">Email</label>
              <input id="profile-email" name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'profile-email-error' : undefined} required />
              {errors.email && <p className="field-error" id="profile-email-error" role="alert">{errors.email}</p>}
              <label htmlFor="profile-phone">Phone</label>
              <input id="profile-phone" name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'profile-phone-error' : undefined} required />
              {errors.phone && <p className="field-error" id="profile-phone-error" role="alert">{errors.phone}</p>}
              <label htmlFor="profile-bio">About</label>
              <textarea id="profile-bio" name="bio" value={form.bio} onChange={updateField} aria-invalid={Boolean(errors.bio)} aria-describedby={errors.bio ? 'profile-bio-error' : undefined} required />
              {errors.bio && <p className="field-error" id="profile-bio-error" role="alert">{errors.bio}</p>}
              <button className="btn btn-primary btn-block" type="submit">Save profile</button>
              {feedback && <p className="success-message" role="status">{feedback}</p>}
            </form>
          </div>
        </div>
      </main>
    </Layout>
  )
}
