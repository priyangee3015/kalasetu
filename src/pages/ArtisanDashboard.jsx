import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import CraftCards from '../components/CraftCards'
import Layout from '../components/Layout'
import OpportunityBoard from '../components/OpportunityBoard'
import { useSession } from '../context/useSession'
import { deleteCraft } from '../features/crafts/craftsSlice'

export default function ArtisanDashboard() {
  const crafts = useSelector(state => state.marketplace.crafts)
  const opportunityCount = useSelector(state => state.marketplace.opportunities.length)
  const dispatch = useDispatch()
  const { session, role } = useSession()
  const { state } = useLocation()

  return (
    <Layout>
      <main id="main-content" className="dashboard">
        <div className="container">
          <h1>Artisan Dashboard</h1>
          <p className="muted dash-intro">Manage your crafts and connect with creative help. Signed in as {session.user.name} ({role}).</p>
          {state?.notice && <p className="success-message" role="status">{state.notice}</p>}
          <div className="dashboard-metrics"><article><strong>{crafts.length}</strong><span>craft listings</span></article><article><strong>{opportunityCount}</strong><span>collaboration opportunities</span></article></div>
          <nav className="dashboard-shortcuts" aria-label="Artisan shortcuts"><Link className="btn btn-primary" to="/crafts/new">Add a craft</Link><Link className="btn btn-primary" to="/rate-freelancer">Rate Freelancer</Link><a className="btn btn-outline" href="#craft-listings">Manage craft listings</a><Link className="btn btn-outline" to="/profile">Edit profile</Link><Link className="btn btn-outline" to="/opportunities/new">Post a collaboration</Link></nav>
          <section className="dash-section">
            <h2>Profile</h2>
            <dl className="profile"><dt>Name</dt><dd>{session.user.name}</dd><dt>Role</dt><dd>{role}</dd><dt>Email</dt><dd>{session.user.email}</dd><dt>Phone</dt><dd>{session.user.phone || 'Not provided'}</dd><dt>About</dt><dd>{session.user.bio || 'No profile description yet.'}</dd></dl>
            <p className="card-actions"><Link className="btn btn-outline" to="/profile">Edit Profile</Link></p>
          </section>
          <section className="dash-section">
            <h2 id="craft-listings">Craft listings</h2>
            <p className="muted">Example listings are provided. New crafts are saved in this browser.</p>
            <CraftCards crafts={crafts} emptyMessage="There are no craft listings yet. Use Add a craft to create the first one." actions={craft => (
              <div className="actions-row">
                <Link className="btn btn-outline" to={`/crafts/${craft.id}/edit`}>Edit</Link>
                <button className="btn btn-outline" type="button" onClick={() => dispatch(deleteCraft(craft.id))} aria-label={`Delete ${craft.title}`}>Delete</button>
              </div>
            )} />
            <p className="card-actions"><Link className="btn btn-primary" to="/crafts/new">Add a craft</Link></p>
          </section>
          <section className="dash-section">
            <h2>Find creative support</h2>
            <p className="muted">Connect with designers, photographers, and marketing specialists who work with craft businesses.</p>
            <Link className="btn btn-outline" to="/freelancer">Browse freelancers</Link>
          </section>
          <section className="dash-section" id="collaboration-board"><h2>Collaboration board</h2><p className="muted">Track opportunities and freelancer responses. Completion and review records are saved in this browser, are not verified transactions, and are not shared across devices. This page does not send messages or create contracts.</p><OpportunityBoard mode="artisan" /><p className="card-actions"><Link className="btn btn-primary" to="/opportunities/new">Post an opportunity</Link></p></section>
        </div>
      </main>
    </Layout>
  )
}
