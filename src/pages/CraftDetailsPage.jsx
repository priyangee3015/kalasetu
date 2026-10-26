import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../components/Layout'
import { selectCraftById, toggleFavorite } from '../features/crafts/craftsSlice'

export default function CraftDetailsPage() {
  const { id } = useParams()
  const craft = useSelector(state => selectCraftById(state, id))
  const favorite = useSelector(state => selectCraftById(state, id) ? state.marketplace.favoriteIds.includes(id) : false)
  const dispatch = useDispatch()

  if (!craft) {
    return <Layout><main id="main-content" className="page-auth"><div className="container container--narrow"><h1>Craft listing not found</h1><p className="muted">This craft may have been removed, or the listing ID is invalid.</p><Link className="btn btn-primary" to="/discover">Back to craft discovery</Link></div></main></Layout>
  }

  return (
    <Layout>
      <main id="main-content" className="craft-details-page">
        <div className="container">
          <p className="back"><Link to="/discover">← Back to craft listings</Link></p>
          <article className="craft-details">
            <div className="craft-details-image-wrap">
              <img className="craft-details-image" src={craft.image || '/images/handloom weavers.jpeg'} alt={craft.title} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/handloom weavers.jpeg' }} />
            </div>
            <div className="craft-details-copy">
              {craft.isSample && <span className="demo-tag">Example listing</span>}
              <p className="craft-card-category">{craft.category || 'Craft'}</p>
              <h1>{craft.title}</h1>
              <p className="muted">{craft.fullDescription || craft.description}</p>
              {craft.priceLabel && <p className="detail-price">{craft.priceLabel}</p>}
              <dl className="detail-list">
                {craft.region && <><dt>Region</dt><dd>{craft.region}</dd></>}
                {craft.material && <><dt>Material</dt><dd>{craft.material}</dd></>}
              </dl>
              <button className="btn btn-primary" type="button" aria-pressed={favorite} onClick={() => dispatch(toggleFavorite(craft.id))}>{favorite ? '♥ Remove from favourites' : '♡ Save to favourites'}</button>
              <p className="demo-note">Prices and profiles shown here are examples. This page does not record sales, stock status, purchases, or reviews.</p>
            </div>
          </article>
          <section className="artisan-profile-card">
            <h2>Artisan information</h2>
            {craft.artisanName
              ? <><h3>{craft.artisanName}</h3><p>{craft.artisanSpecialty || 'Artisan craft profile'}</p>{craft.artisanLocation && <p className="muted">{craft.artisanLocation}</p>}<p className="muted">{craft.artisanBio || 'No additional artisan information is available.'}</p>{craft.isSample && <span className="demo-tag">Example profile</span>}</>
              : <p className="muted">This listing does not include artisan profile details.</p>}
          </section>
        </div>
      </main>
    </Layout>
  )
}
