import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../components/Layout'
import FreelancerRatingSummary from '../components/FreelancerRatingSummary'
import FreelancerReviewForm from '../components/FreelancerReviewForm'
import FreelancerReviews from '../components/FreelancerReviews'
import { useSession } from '../context/useSession'
import { completeCollaboration } from '../features/crafts/craftsSlice'

export default function RateFreelancerPage() {
  const { session } = useSession()
  const dispatch = useDispatch()
  const opportunities = useSelector(state => state.marketplace.opportunities)
  const interests = useSelector(state => state.marketplace.interests)
  const completions = useSelector(state => state.marketplace.completedCollaborations)
  const reviews = useSelector(state => state.marketplace.reviews)
  const [selectedKey, setSelectedKey] = useState('')
  const artisanId = session.user.id

  const collaborations = useMemo(() => opportunities
    .filter(opportunity => opportunity.creatorId === artisanId)
    .flatMap(opportunity => interests
      .filter(interest => interest.opportunityId === opportunity.id && interest.userId !== artisanId)
      .map(interest => ({
        key: `${opportunity.id}:${interest.userId}`,
        opportunity,
        freelancer: interest,
        completion: completions.find(item => item.opportunityId === opportunity.id && item.freelancerId === interest.userId),
        review: reviews.find(item => item.opportunityId === opportunity.id && item.freelancerId === interest.userId && item.reviewerId === artisanId),
      }))), [opportunities, interests, completions, reviews, artisanId])

  const selected = collaborations.find(item => item.key === selectedKey) ?? collaborations[0]
  const markCompleted = () => {
    if (!selected) return
    dispatch(completeCollaboration({
      opportunityId: selected.opportunity.id,
      freelancerId: selected.freelancer.userId,
      artisanId,
      artisanName: session.user.name,
    }))
  }

  return <Layout>
    <main id="main-content" className="page-auth">
      <div className="container container--narrow">
        <p className="back"><Link to="/artisan">← Back to Artisan Dashboard</Link></p>
        <h1>Rate a Freelancer</h1>
        <p className="muted">Choose a freelancer who expressed interest in one of your opportunities. Mark the collaboration complete before submitting a rating.</p>
        <p className="muted">Ratings and reviews are stored in this browser. They are not verified transaction feedback or shared across devices.</p>

        {collaborations.length === 0 ? <div className="empty-state rating-page-empty" role="status">
          <h2>No freelancers are ready for a rating</h2>
          <p>Freelancers will appear here after they express interest in one of your collaboration opportunities. Once the work is complete, you can mark it complete and leave a rating.</p>
          <Link className="btn btn-primary" to="/artisan#collaboration-board">View collaboration opportunities</Link>
        </div> : <div className="auth-card rate-freelancer-card">
          <label htmlFor="rate-collaboration">Freelancer and collaboration</label>
          <select id="rate-collaboration" value={selected?.key ?? ''} onChange={event => setSelectedKey(event.target.value)}>
            {collaborations.map(item => <option value={item.key} key={item.key}>{item.freelancer.userName} — {item.opportunity.title}</option>)}
          </select>
          {selected && <section className="rate-freelancer-selected" aria-labelledby="selected-freelancer-name">
            <h2 id="selected-freelancer-name">{selected.freelancer.userName}</h2>
            <p className="muted">Collaboration: {selected.opportunity.title}</p>
            <FreelancerRatingSummary freelancerId={selected.freelancer.userId} />
            <FreelancerReviews freelancerId={selected.freelancer.userId} />
            {selected.completion
              ? <><span className="status-pill">Collaboration completed</span><FreelancerReviewForm key={selected.key} opportunity={selected.opportunity} freelancer={selected.freelancer} reviewer={session.user} existingReview={selected.review} /></>
              : <div className="completion-prompt"><p>Confirm the work is complete to unlock the rating form.</p><button className="btn btn-primary" type="button" onClick={markCompleted}>Mark collaboration completed</button></div>}
          </section>}
        </div>}
      </div>
    </main>
  </Layout>
}
