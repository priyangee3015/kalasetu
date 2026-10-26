import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSession } from '../context/useSession'
import { dashboardForRole } from '../routes/roleRoutes'

export default function Navbar() {
  const { session, role, signOut } = useSession()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const handleLogout = () => {
    signOut()
    closeMenu()
    navigate('/', { replace: true })
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" onClick={closeMenu}>
            <img src="/images/kalasetu-logo.png" className="brand-logo" alt="" />
            <span className="brand-name">Kalasetu</span>
          </Link>
          <button className="hamburger" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>
            {menuOpen ? '×' : '☰'}
          </button>
          <nav className={`site-nav${menuOpen ? ' active' : ''}`} aria-label="Primary">
            <ul>
              <li><NavLink end to="/" onClick={closeMenu}>Home</NavLink></li>
              <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
              {session && <li><NavLink to={dashboardForRole(role)} onClick={closeMenu}>My Dashboard</NavLink></li>}
              <li><NavLink to="/discover" onClick={closeMenu}>Discover</NavLink></li>
              <li><NavLink to="/favorites" onClick={closeMenu}>Favourites</NavLink></li>
              <li><Link to="/#contact" onClick={closeMenu}>Contact</Link></li>
              {session
                ? <li><button className="nav-link" type="button" onClick={handleLogout}>Logout</button></li>
                : <li><Link to="/login" onClick={closeMenu}>Login</Link></li>}
            </ul>
          </nav>
          {!session && <Link className="btn btn-outline header-join" to="/register">Join us</Link>}
        </div>
      </header>
    </>
  )
}
