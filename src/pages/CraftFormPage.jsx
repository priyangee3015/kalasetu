import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../components/Layout'
import { useSession } from '../context/useSession'
import { addCraft, editCraft } from '../features/crafts/craftsSlice'

const categories = ['Handloom textiles', 'Pottery & ceramics', 'Metalwork', 'Embroidery & needlework', 'Weaving & home textiles', 'Basketry & natural fibres', 'Block printing', 'Other crafts']
const blankCraft = { title: '', category: 'Handloom textiles', region: '', description: '', fullDescription: '', material: '', priceLabel: '', priceMin: '', priceMax: null, artisanName: '', artisanSpecialty: '', artisanLocation: '', artisanBio: '', image: '' }
const imageIsValid = value => !value || value.startsWith('/') || /^https?:\/\//i.test(value)

export default function CraftFormPage({ editing = false }) {
  const crafts = useSelector(state => state.marketplace.crafts)
  const { id } = useParams()
  const location = useLocation()
  const { session } = useSession()
  const legacyEdit = location.pathname === '/edit_craft.html'
  const craftId = id ?? (legacyEdit ? crafts[0]?.id : undefined)
  const currentCraft = crafts.find(craft => craft.id === craftId)
  const newCraft = { ...blankCraft, artisanName: session?.role === 'artisan' ? session.user.name : '' }
  return <CraftEditor key={`${editing ? 'edit' : 'add'}-${craftId ?? 'new'}`} editing={editing} craftId={craftId} currentCraft={currentCraft} initialCraft={currentCraft || newCraft} />
}

function CraftEditor({ editing, craftId, currentCraft, initialCraft }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState(() => ({ ...initialCraft }))
  const [errors, setErrors] = useState({})

  const updateField = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    if (form.title.trim().length < 2) nextErrors.title = 'Enter a craft title (at least 2 characters).'
    if (!form.category.trim()) nextErrors.category = 'Choose a craft category.'
    if (!form.region.trim()) nextErrors.region = 'Enter the craft’s region.'
    if (form.description.trim().length < 10) nextErrors.description = 'Add a short description of at least 10 characters.'
    if (form.priceMin !== '' && (!Number.isFinite(Number(form.priceMin)) || Number(form.priceMin) < 0)) nextErrors.priceMin = 'Enter a non-negative price, or leave it blank.'
    if (!imageIsValid(form.image.trim())) nextErrors.image = 'Use a site path such as /images/craft.jpg or a full http(s) image URL.'
    return nextErrors
  }

  const handleSubmit = event => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const priceMin = form.priceMin === '' ? null : Number(form.priceMin)
    const craft = {
      ...form,
      title: form.title.trim(),
      category: form.category.trim(),
      region: form.region.trim(),
      description: form.description.trim(),
      fullDescription: form.fullDescription.trim() || form.description.trim(),
      material: form.material.trim(),
      priceMin,
      priceLabel: form.priceLabel.trim() || (priceMin === null ? '' : `From ₹${priceMin.toLocaleString('en-IN')}`),
      artisanName: form.artisanName.trim(),
      artisanSpecialty: form.artisanSpecialty.trim(),
      artisanLocation: form.artisanLocation.trim(),
      artisanBio: form.artisanBio.trim(),
      image: form.image.trim(),
    }
    if (editing) {
      dispatch(editCraft({ ...craft, id: craftId }))
      navigate('/artisan', { state: { notice: `${craft.title} was updated in the saved craft list.` } })
    } else {
      dispatch(addCraft(craft))
      navigate('/artisan', { state: { notice: `${craft.title} was added to the saved craft list.` } })
    }
  }

  if (editing && !currentCraft) {
    return <Layout><main id="main-content" className="page-auth"><div className="container container--narrow"><h1>Craft not found</h1><p className="muted">This listing may have been removed, or the craft ID is invalid.</p><Link className="btn btn-primary" to="/artisan">Back to artisan dashboard</Link></div></main></Layout>
  }

  return (
    <Layout>
      <main id="main-content" className="page-auth">
        <div className="container container--narrow">
          <p className="back"><Link to="/artisan">← Back to crafts</Link></p>
          <h1>{editing ? 'Edit Craft' : 'Add New Craft'}</h1>
          <p className="muted">Craft changes are saved in this browser.</p>
          <div className="auth-card">
            <form className="form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="craft-title">Craft name</label>
              <input id="craft-title" name="title" value={form.title} onChange={updateField} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'craft-title-error' : undefined} required />
              {errors.title && <p className="field-error" id="craft-title-error" role="alert">{errors.title}</p>}
              <label htmlFor="craft-category">Category</label>
              <select id="craft-category" name="category" value={form.category} onChange={updateField} aria-invalid={Boolean(errors.category)}>
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
              {errors.category && <p className="field-error" role="alert">{errors.category}</p>}
              <label htmlFor="craft-region">Region</label>
              <input id="craft-region" name="region" value={form.region} onChange={updateField} aria-invalid={Boolean(errors.region)} aria-describedby={errors.region ? 'craft-region-error' : undefined} required />
              {errors.region && <p className="field-error" id="craft-region-error" role="alert">{errors.region}</p>}
              <label htmlFor="craft-description">Short description</label>
              <textarea id="craft-description" name="description" value={form.description} onChange={updateField} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'craft-description-error' : undefined} required />
              {errors.description && <p className="field-error" id="craft-description-error" role="alert">{errors.description}</p>}
              <label htmlFor="craft-full-description">Full details (optional)</label>
              <textarea id="craft-full-description" name="fullDescription" value={form.fullDescription} onChange={updateField} />
              <label htmlFor="craft-material">Materials (optional)</label>
              <input id="craft-material" name="material" value={form.material} onChange={updateField} />
              <label htmlFor="craft-price">Starting price in rupees (optional)</label>
              <input id="craft-price" name="priceMin" type="number" min="0" step="1" value={form.priceMin ?? ''} onChange={updateField} aria-invalid={Boolean(errors.priceMin)} aria-describedby={errors.priceMin ? 'craft-price-error' : undefined} />
              {errors.priceMin && <p className="field-error" id="craft-price-error" role="alert">{errors.priceMin}</p>}
              <label htmlFor="craft-image">Image path or URL (optional)</label>
              <input id="craft-image" name="image" type="text" value={form.image} onChange={updateField} placeholder="/images/handloom weavers.jpeg" aria-invalid={Boolean(errors.image)} aria-describedby={errors.image ? 'craft-image-error' : undefined} />
              {errors.image && <p className="field-error" id="craft-image-error" role="alert">{errors.image}</p>}
              <details className="optional-details"><summary>Optional artisan information</summary>
                <label htmlFor="artisan-name">Display name</label><input id="artisan-name" name="artisanName" value={form.artisanName} onChange={updateField} />
                <label htmlFor="artisan-specialty">Specialty</label><input id="artisan-specialty" name="artisanSpecialty" value={form.artisanSpecialty} onChange={updateField} />
                <label htmlFor="artisan-location">Artisan location</label><input id="artisan-location" name="artisanLocation" value={form.artisanLocation} onChange={updateField} />
                <label htmlFor="artisan-bio">Short artisan bio</label><textarea id="artisan-bio" name="artisanBio" value={form.artisanBio} onChange={updateField} />
              </details>
              <div className="form-stack"><button className="btn btn-primary btn-block" type="submit">Save craft</button><Link className="btn btn-outline btn-block" to="/artisan">Cancel</Link></div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  )
}
