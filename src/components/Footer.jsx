import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-container">
        <section className="footer-section">
          <h3>Kalasetu</h3>
          <p>Connecting artisans with creative freelancers to showcase handmade work with care.</p>
        </section>
        <section className="footer-section">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/discover">Discover crafts</Link></li>
            <li><Link to="/favorites">Favourites</Link></li>
          </ul>
        </section>
        <section className="footer-section">
          <h4>Contact</h4>
          <p><a href="mailto:hello@kalasetu.in">hello@kalasetu.in</a></p>
          <p>+91 9876543210</p>
        </section>
      </div>
      <div className="footer-bottom">© Kalasetu · Celebrating living craft traditions</div>
    </footer>
  )
}
