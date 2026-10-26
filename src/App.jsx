import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import AboutPage from './pages/AboutPage'
import ArtisanDashboard from './pages/ArtisanDashboard'
import AuthPage from './pages/AuthPage'
import CraftFormPage from './pages/CraftFormPage'
import FreelancerDashboard from './pages/FreelancerDashboard'
import FavoritesPage from './pages/FavoritesPage'
import CraftDetailsPage from './pages/CraftDetailsPage'
import HomePage from './pages/HomePage'
import Layout from './components/Layout'
import ProfileFormPage from './pages/ProfileFormPage'
import OpportunityFormPage from './pages/OpportunityFormPage'
import UserPanel from './pages/UserPanel'
import DiscoverPage from './pages/DiscoverPage'
import RequireRole from './components/RequireRole'
import RateFreelancerPage from './pages/RateFreelancerPage'

function NotFoundPage() {
  return (
    <Layout>
      <main id="main-content" className="page-auth">
        <div className="container container--narrow">
          <h1>Page not found</h1>
          <p className="muted">That Kalasetu page could not be found.</p>
          <Link className="btn btn-primary" to="/">Return home</Link>
        </div>
      </main>
    </Layout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/index.html" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/login.html" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/register.html" element={<AuthPage mode="register" />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/about.html" element={<AboutPage />} />
      <Route path="/artisan" element={<RequireRole role="artisan"><ArtisanDashboard /></RequireRole>} />
      <Route path="/artisan_home.html" element={<RequireRole role="artisan"><ArtisanDashboard /></RequireRole>} />
      <Route path="/rate-freelancer" element={<RequireRole role="artisan"><RateFreelancerPage /></RequireRole>} />
      <Route path="/freelancer" element={<RequireRole role="freelancer"><FreelancerDashboard /></RequireRole>} />
      <Route path="/freelancer_home.html" element={<RequireRole role="freelancer"><FreelancerDashboard /></RequireRole>} />
      <Route path="/panel" element={<RequireRole role="customer"><UserPanel /></RequireRole>} />
      <Route path="/home_user.html" element={<RequireRole role="customer"><UserPanel /></RequireRole>} />
      <Route path="/user_panel.html" element={<RequireRole role="customer"><UserPanel /></RequireRole>} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/crafts/:id" element={<CraftDetailsPage />} />
      <Route path="/crafts/new" element={<RequireRole role="artisan"><CraftFormPage /></RequireRole>} />
      <Route path="/opportunities/new" element={<RequireRole role="artisan"><OpportunityFormPage /></RequireRole>} />
      <Route path="/add_craft.html" element={<RequireRole role="artisan"><CraftFormPage /></RequireRole>} />
      <Route path="/crafts/:id/edit" element={<RequireRole role="artisan"><CraftFormPage editing /></RequireRole>} />
      <Route path="/edit_craft.html" element={<RequireRole role="artisan"><CraftFormPage editing /></RequireRole>} />
      <Route path="/profile" element={<RequireRole><ProfileFormPage /></RequireRole>} />
      <Route path="/edit_profile.html" element={<RequireRole><ProfileFormPage /></RequireRole>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
