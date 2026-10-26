import { Link } from 'react-router-dom'
import CraftDiscovery from '../components/CraftDiscovery'
import Layout from '../components/Layout'

export default function DiscoverPage() {
  return <Layout>
    <main id="main-content" className="dashboard">
      <div className="container">
        <h1>Discover handmade crafts</h1>
        <p className="muted dash-intro">Browse the craft collection by name, category, material, region, or artisan.</p>
        <div className="panel-shortcuts"><Link className="btn btn-outline" to="/favorites">Saved favourites</Link><span className="demo-tag">Example listings and profiles</span></div>
        <CraftDiscovery heading="Browse craft listings" description="Use search, category, and sort together to refine the collection." />
        <section className="dash-section"><h2>Discover a location</h2><p className="muted">Browse by region, or use the optional location feature on the <Link to="/">home page</Link>. The location feature centers an external map; it does not filter by distance.</p></section>
      </div>
    </main>
  </Layout>
}
