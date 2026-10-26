import { Link } from 'react-router-dom'

export default function CraftCards({ crafts, actions, emptyMessage = 'No listings yet. Add a craft to get started.', clickable = false, favoriteIds = [], onToggleFavorite }) {
  if (crafts.length === 0) return <div className="empty-state" role="status"><h3>No crafts to show</h3><p>{emptyMessage}</p></div>

  return (
    <div className="grid">
      {crafts.map(craft => (
        <article className="card" key={craft.id}>
          {clickable ? <Link className="craft-card-link" to={`/crafts/${craft.id}`} aria-label={`View details for ${craft.title}`}>
            <img src={craft.image || '/images/kalasetu-logo.png'} alt={craft.title} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/kalasetu-logo.png' }} />
            <span className="craft-card-category">{craft.category || 'Craft'}</span>
            <h3>{craft.title}</h3>
            <p>{craft.description}</p>
            <span className="card-region">Region: {craft.region || 'Not specified'}</span>
            {craft.priceLabel && <span className="craft-price">{craft.priceLabel}</span>}
            {craft.artisanName && <span className="craft-artisan">By {craft.artisanName}</span>}
            {craft.isSample && <span className="demo-tag">Example listing</span>}
            <span className="card-hint">View craft details →</span>
          </Link> : <>
            {craft.image && <img src={craft.image} alt={craft.title} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/kalasetu-logo.png' }} />}
            {craft.category && <span className="craft-card-category">{craft.category}</span>}
            <h3>{craft.title}</h3>
            <p>{craft.description}</p>
            {craft.region && <span className="card-region">Region: {craft.region}</span>}
            {craft.priceLabel && <span className="craft-price">{craft.priceLabel}</span>}
            {craft.artisanName && <span className="craft-artisan">By {craft.artisanName}</span>}
            {craft.isSample && <span className="demo-tag">Example listing</span>}
          </>}
          {onToggleFavorite && <button className="favorite-button" type="button" aria-pressed={favoriteIds.includes(craft.id)} aria-label={`${favoriteIds.includes(craft.id) ? 'Remove' : 'Add'} ${craft.title} ${favoriteIds.includes(craft.id) ? 'from' : 'to'} favourites`} onClick={() => onToggleFavorite(craft.id)}>{favoriteIds.includes(craft.id) ? '♥ Saved' : '♡ Save'}</button>}
          {actions?.(craft)}
        </article>
      ))}
    </div>
  )
}
