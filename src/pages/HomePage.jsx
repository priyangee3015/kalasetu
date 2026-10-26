import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CraftDiscovery from '../components/CraftDiscovery'
import Layout from '../components/Layout'

export default function HomePage() {
  const crafts = useSelector(state => state.marketplace.crafts)
  const [locationMessage, setLocationMessage] = useState('')
  const [mapUrl, setMapUrl] = useState('https://www.openstreetmap.org/search?query=India')
  const categories = [...new Set(crafts.map(craft => craft.category).filter(Boolean))].slice(0, 5)

  const findNearby = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is unavailable in this browser. Browse by region instead.')
      return
    }
    setLocationMessage('Requesting location permission…')
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setLocationMessage(`OpenStreetMap can be centered near ${latitude.toFixed(3)}, ${longitude.toFixed(3)}.`)
      setMapUrl(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=12/${latitude}/${longitude}`)
    }, () => setLocationMessage('Location permission was not granted. Browse artisans by region below.'), { timeout: 8000 })
  }

  return (
    <Layout>
      <main id="main-content">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-visual"><img className="hero-logo" src="/images/kalasetu-logo.png" alt="Kalasetu" /></div>
            <div>
              <p className="hero-tagline">Connecting artisans with creative freelancers</p>
              <h1>Connecting Artisans with Creative Freelancers</h1>
              <p className="hero-lead">Kalasetu helps handloom makers get the right design, web, and marketing support—so your craft is seen and valued.</p>
              <div className="hero-actions"><Link className="btn btn-outline" to="/discover">Explore crafts</Link><Link className="btn btn-primary" to="/register">Join Kalasetu</Link></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <CraftDiscovery heading="Featured handloom & crafts" description="Search listings by craft, material, artisan, or region." limit={6} />
            <div className="category-links" aria-label="Browse craft categories">
              <span>Browse by craft:</span>
              {categories.map(category => <Link className="category-chip" key={category} to={`/discover?category=${encodeURIComponent(category)}`}>{category}</Link>)}
            </div>
            <p className="center-action"><Link className="btn btn-outline" to="/discover">Explore all crafts</Link></p>
          </div>
        </section>

        <section className="section location-section">
          <div className="container">
            <h2>Discover artisans near you</h2>
            <p className="muted">Open a map centered near you, or browse craft communities by region.</p>
            <button className="btn btn-primary" type="button" onClick={findNearby}>Use my location</button>
            {locationMessage && <p className="location-message" role="status">{locationMessage} <a target="_blank" rel="noreferrer" href={mapUrl}>Open map</a></p>}
            <p className="muted">No map key is required. Location only centers the external map; it does not filter listings by distance. If access is unavailable, browse the regional listings above.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>How Kalasetu works</h2>
            <p className="muted">A simple path from a craft story to a creative collaboration.</p>
            <ol className="steps"><li><span className="num">1</span><h3>Showcase the craft</h3><p>Artisans create a listing with details about the material, region, and making tradition.</p></li><li><span className="num">2</span><h3>Find creative support</h3><p>Freelancers browse opportunities in design, photography, web, writing, and social media.</p></li><li><span className="num">3</span><h3>Share the story</h3><p>Customers discover handmade work and the people behind it.</p></li></ol>
            <h2 className="section-subheading">Made possible together</h2>
            <div className="grid-3">
              <article className="card"><h3>For Artisans</h3><p>Share your craft and connect with support to tell its story.</p><Link to="/register">Create an artisan profile →</Link></article>
              <article className="card"><h3>For Freelancers</h3><p>Bring your creative and digital skills to meaningful collaborations.</p><Link to="/freelancer">Meet our freelancers →</Link></article>
              <article className="card"><h3>For Customers</h3><p>Discover handmade work with a story and a living tradition.</p><Link to="/discover">Browse the collection →</Link></article>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
