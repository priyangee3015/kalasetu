import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CraftCards from '../components/CraftCards'
import Layout from '../components/Layout'
import { removeFavorite, selectFavorites } from '../features/crafts/craftsSlice'

export default function FavoritesPage() {
  const favorites = useSelector(selectFavorites)
  const dispatch = useDispatch()

  return (
    <Layout>
      <main id="main-content" className="dashboard">
        <div className="container">
          <p className="back"><Link to="/discover">← Back to discovery</Link></p>
          <h1>Your favourite crafts</h1>
          <p className="muted dash-intro">Your saved crafts are stored in this browser.</p>
          <CraftCards
            crafts={favorites}
            clickable
            emptyMessage="You have not saved any crafts yet. Browse the listings and choose Save on a craft you like."
            actions={craft => <button className="btn btn-outline" type="button" onClick={() => dispatch(removeFavorite(craft.id))}>Remove from favourites</button>}
          />
          {favorites.length === 0 && <Link className="btn btn-primary" to="/discover">Browse crafts</Link>}
        </div>
      </main>
    </Layout>
  )
}
