import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Layout from '../components/Layout'
import { useSession } from '../context/useSession'
import { addOpportunity } from '../features/crafts/craftsSlice'
import { serviceCategories } from '../features/crafts/sampleData'

export default function OpportunityFormPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { session } = useSession()
  const [form, setForm] = useState({ title: '', service: serviceCategories[0], requirements: '', budget: '' })
  const [errors, setErrors] = useState({})

  const updateField = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  const handleSubmit = event => {
    event.preventDefault()
    const nextErrors = {}
    if (form.title.trim().length < 4) nextErrors.title = 'Enter a clear opportunity title.'
    if (!serviceCategories.includes(form.service)) nextErrors.service = 'Choose a service category.'
    if (form.requirements.trim().length < 20) nextErrors.requirements = 'Describe the work in at least 20 characters.'
    if (form.budget !== '' && (!Number.isFinite(Number(form.budget)) || Number(form.budget) < 0)) nextErrors.budget = 'Enter a non-negative budget or leave it blank.'
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    dispatch(addOpportunity({
      title: form.title.trim(),
      service: form.service,
      requirements: form.requirements.trim(),
      budget: form.budget === '' ? null : Number(form.budget),
      creatorName: session.user.name,
      creatorId: session.user.id,
    }))
    navigate('/artisan', { state: { notice: `“${form.title.trim()}” was added to the collaboration board.` } })
  }

  return (
    <Layout>
      <main id="main-content" className="page-auth">
        <div className="container container--narrow">
          <p className="back"><Link to="/artisan">← Back to artisan dashboard</Link></p>
          <h1>Post a collaboration opportunity</h1>
          <p className="muted">Describe the help your craft project needs. Posts are stored in this browser and do not send messages or create contracts.</p>
          <div className="auth-card">
            <form className="form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="opportunity-title">Opportunity title</label>
              <input id="opportunity-title" name="title" value={form.title} onChange={updateField} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'opportunity-title-error' : undefined} required />
              {errors.title && <p className="field-error" id="opportunity-title-error" role="alert">{errors.title}</p>}
              <label htmlFor="opportunity-service">Service needed</label>
              <select id="opportunity-service" name="service" value={form.service} onChange={updateField}>
                {serviceCategories.map(category => <option value={category} key={category}>{category}</option>)}
              </select>
              {errors.service && <p className="field-error" role="alert">{errors.service}</p>}
              <label htmlFor="opportunity-requirements">Requirements</label>
              <textarea id="opportunity-requirements" name="requirements" value={form.requirements} onChange={updateField} aria-invalid={Boolean(errors.requirements)} aria-describedby={errors.requirements ? 'opportunity-requirements-error' : undefined} required />
              {errors.requirements && <p className="field-error" id="opportunity-requirements-error" role="alert">{errors.requirements}</p>}
              <label htmlFor="opportunity-budget">Optional budget estimate (₹)</label>
              <input id="opportunity-budget" name="budget" type="number" min="0" step="1" value={form.budget} onChange={updateField} aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? 'opportunity-budget-error' : undefined} />
              {errors.budget && <p className="field-error" id="opportunity-budget-error" role="alert">{errors.budget}</p>}
              <div className="form-stack"><button className="btn btn-primary btn-block" type="submit">Post opportunity</button><Link className="btn btn-outline btn-block" to="/artisan">Cancel</Link></div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  )
}
