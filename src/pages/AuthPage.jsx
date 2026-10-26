import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useSession } from '../context/useSession'
import { canRoleAccessPath, dashboardForRole } from '../routes/roleRoutes'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?[0-9\s()-]+$/

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const { signIn } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'artisan' })
  const [errors, setErrors] = useState({})

  const updateField = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (isRegister && form.name.trim().length < 2) nextErrors.name = 'Enter your name (at least 2 characters).'
    if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!phonePattern.test(form.phone.trim()) || form.phone.replace(/\D/g, '').length < 7) nextErrors.phone = 'Enter a valid phone number.'
    if (form.password.length < 6) nextErrors.password = 'Enter at least 6 characters.'
    return nextErrors
  }

  const handleSubmit = event => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const name = form.name.trim() || form.email.trim().split('@')[0]
    const user = { name, email: form.email.trim(), phone: form.phone.trim() }
    signIn(user, form.role)
    const requested = location.state?.from
    const destination = requested && canRoleAccessPath(requested.pathname, form.role)
      ? `${requested.pathname}${requested.search || ''}${requested.hash || ''}`
      : dashboardForRole(form.role)
    navigate(destination, { replace: true, state: { notice: `Local session started for ${name} (${form.role}). No password was verified.` } })
  }

  return (
    <Layout>
      <main id="main-content" className="page-auth">
        <div className="container container--narrow">
          <p className="back"><Link to="/">← Home</Link></p>
          <h1>{isRegister ? 'Create a profile' : 'Welcome back'}</h1>
          <p className="muted">Choose your role to continue. Your profile and session are stored in this browser; this site does not verify identities or passwords.</p>
          <div className="auth-card">
            <form className="form" onSubmit={handleSubmit} noValidate>
              {isRegister && <>
                <label htmlFor="auth-name">Name</label>
                <input id="auth-name" name="name" value={form.name} onChange={updateField} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} required />
                {errors.name && <p className="field-error" id="name-error" role="alert">{errors.name}</p>}
              </>}
              <label htmlFor="auth-email">Email</label>
              <input id="auth-email" name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} required />
              {errors.email && <p className="field-error" id="email-error" role="alert">{errors.email}</p>}
              <label htmlFor="auth-phone">Phone</label>
              <input id="auth-phone" name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} required />
              {errors.phone && <p className="field-error" id="phone-error" role="alert">{errors.phone}</p>}
              <label htmlFor="auth-password">Password</label>
              <input id="auth-password" name="password" type="password" value={form.password} onChange={updateField} autoComplete={isRegister ? 'new-password' : 'current-password'} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} required minLength={6} />
              {errors.password && <p className="field-error" id="password-error" role="alert">{errors.password}</p>}
              <label htmlFor="auth-role">I am a</label>
              <select id="auth-role" name="role" value={form.role} onChange={updateField}>
                <option value="artisan">Artisan</option><option value="freelancer">Freelancer</option><option value="customer">Customer</option>
              </select>
              <button className="btn btn-primary btn-block" type="submit">{isRegister ? 'Save profile' : 'Continue'}</button>
            </form>
            <p className="form-note">{isRegister ? 'Already a member?' : 'New here?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Create an account'}</Link></p>
          </div>
        </div>
      </main>
    </Layout>
  )
}
