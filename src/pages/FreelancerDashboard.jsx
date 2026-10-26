import { Link, useLocation } from 'react-router-dom'
import CraftCards from '../components/CraftCards'
import Layout from '../components/Layout'
import OpportunityBoard from '../components/OpportunityBoard'
import { useSession } from '../context/useSession'
import { serviceCategories } from '../features/crafts/sampleData'
import FreelancerRatingSummary from '../components/FreelancerRatingSummary'
import FreelancerReviews from '../components/FreelancerReviews'

const freelancers = [
  { id: 'neha', title: 'Neha Kapoor', region: 'Mumbai, Maharashtra', description: 'Visual designer · Brand identity, product lookbooks, and social kits.', image: '/images/Designer.webp' },
  { id: 'vikram', title: 'Vikram Singh', region: 'Jaipur, Rajasthan', description: 'Product photographer · Texture-rich stories for handmade work.', image: '/images/photographer.jpeg' },
  { id: 'sneha', title: 'Sneha Reddy', region: 'Hyderabad, Telangana', description: 'Digital marketer · Ethical SEO and campaigns for artisan brands.', image: '/images/digital marketer.jpeg' },
]
const serviceImages = {
  'Graphic design': '/images/Designer.webp',
  Photography: '/images/Photographer.webp',
  'Web development': '/images/Web Developer.webp',
  'Content writing': '/images/content writer.jpeg',
  'Social media management': '/images/social media .jpeg',
}

export default function FreelancerDashboard() {
  const { session, role } = useSession()
  const { state } = useLocation()

  return (
    <Layout>
      <main id="main-content" className="dashboard">
        <div className="container">
          <h1>Freelancer Dashboard</h1>
          <p className="muted dash-intro">Meet creative partners ready to work with India's craft communities. Signed in as {session.user.name} ({role}).</p>
          {state?.notice && <p className="success-message" role="status">{state.notice}</p>}
          {session && role === 'freelancer' && <section className="rating-profile" aria-labelledby="my-rating-heading"><h2 id="my-rating-heading">Your freelancer rating</h2><p className="muted">Ratings and reviews are saved only in this browser. They are not verified transaction feedback or shared across devices.</p><FreelancerRatingSummary freelancerId={session.user.id} /><FreelancerReviews freelancerId={session.user.id} /></section>}
          <h2>Creative service categories</h2>
          <div className="service-grid">{serviceCategories.map(service => <article className="service-card" key={service}><img src={serviceImages[service]} alt="" /><h3>{service}</h3></article>)}</div>
          <h2 className="section-subheading">Example creative partners</h2>
          <CraftCards crafts={freelancers} actions={freelancer => <div className="card-actions"><FreelancerRatingSummary freelancerId={freelancer.id} /><details className="freelancer-reviews-details"><summary>Read reviews</summary><FreelancerReviews freelancerId={freelancer.id} /></details><a className="btn btn-primary" href={`mailto:hello@kalasetu.in?subject=${encodeURIComponent(`Freelancer collaboration with ${freelancer.title}`)}`}>Contact</a></div>} />
          <section className="dash-section"><h2>Artisan collaboration opportunities</h2><p className="muted">Browse example opportunities and requests saved in this browser. Expressing interest does not send a message or create a contract.</p><OpportunityBoard mode="freelancer" /></section>
          <section className="dash-section"><h2>For your next collaboration</h2><p className="muted">Create a profile with the Freelancer role to express interest in available work. Your activity stays in this browser.</p><Link className="btn btn-outline" to="/register">Create a profile</Link></section>
        </div>
      </main>
    </Layout>
  )
}
