import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSession } from '../context/useSession'
import { completeCollaboration, expressInterest, selectOpportunities } from '../features/crafts/craftsSlice'
import FreelancerRatingSummary from './FreelancerRatingSummary'
import FreelancerReviewForm from './FreelancerReviewForm'
import FreelancerReviews from './FreelancerReviews'

const formatBudget = budget => Number.isFinite(budget) ? `Budget: ₹${budget.toLocaleString('en-IN')}` : 'Budget not specified'

export default function OpportunityBoard({ mode = 'freelancer', opportunities }) {
  const allOpportunities = useSelector(selectOpportunities)
  const allInterests = useSelector(state => state.marketplace.interests)
  const completions = useSelector(state => state.marketplace.completedCollaborations)
  const reviews = useSelector(state => state.marketplace.reviews)
  const items = opportunities ?? allOpportunities
  const { session, role } = useSession()
  const dispatch = useDispatch()
  const [feedback, setFeedback] = useState('')

  const sendInterest = opportunity => {
    if (!session || role !== 'freelancer') return
    const alreadyInterested = allInterests.some(interest => interest.opportunityId === opportunity.id && interest.userId === session.user.id)
    if (alreadyInterested) return
    dispatch(expressInterest({ opportunityId: opportunity.id, userId: session.user.id, userName: session.user.name }))
    setFeedback(`Interest recorded for “${opportunity.title}”.`)
  }

  if (items.length === 0) {
    return <div className="empty-state" role="status"><h3>No opportunities yet</h3><p>When an artisan posts a service request, it will appear here.</p></div>
  }

  return (
    <div className="opportunity-list">
      {feedback && <p className="success-message" role="status">{feedback}</p>}
      {items.map(opportunity => {
        const interests = allInterests.filter(interest => interest.opportunityId === opportunity.id)
        const interested = session && allInterests.some(interest => interest.opportunityId === opportunity.id && interest.userId === session.user.id)
        return (
          <article className="opportunity-card" key={opportunity.id}>
            <div className="opportunity-topline"><span className="craft-card-category">{opportunity.service}</span><span className={`status-pill status-${opportunity.status.toLowerCase()}`}>{opportunity.status}</span></div>
            <h3>{opportunity.title}</h3>
            <p>{opportunity.requirements}</p>
            <p className="muted">Posted by {opportunity.creatorName} · {formatBudget(opportunity.budget)}</p>
            {opportunity.isSample && <span className="demo-tag">Example opportunity</span>}
            {mode === 'artisan' ? <div className="interest-summary"><strong>{interests.length} {interests.length === 1 ? 'expression' : 'expressions'} of interest</strong>{interests.map(interest => {
              const completion = completions.find(item => item.opportunityId === opportunity.id && item.freelancerId === interest.userId)
              const review = reviews.find(item => item.opportunityId === opportunity.id && item.freelancerId === interest.userId && item.reviewerId === session?.user.id)
              const mayManage = role === 'artisan' && opportunity.creatorId === session?.user.id
              return <div className="interest-person" key={interest.id}>
                <strong>{interest.userName}</strong><FreelancerRatingSummary freelancerId={interest.userId} />
                {mayManage && !completion && <button className="btn btn-outline" type="button" onClick={() => dispatch(completeCollaboration({ opportunityId: opportunity.id, freelancerId: interest.userId, artisanId: session.user.id, artisanName: session.user.name }))}>Mark collaboration completed</button>}
                {completion && <><span className="status-pill">Completed</span><FreelancerReviews freelancerId={interest.userId} />{mayManage && <FreelancerReviewForm opportunity={opportunity} freelancer={interest} reviewer={session.user} existingReview={review} />}</>}
              </div>
            })}</div>
                : session && role === 'freelancer'
                ? <button className="btn btn-primary" type="button" disabled={interested || opportunity.status !== 'Open'} onClick={() => sendInterest(opportunity)}>{interested ? 'Interest sent' : 'Express interest'}</button>
                : <p className="muted">Sign in as a freelancer to express interest. <Link to="/login">Sign in</Link></p>}
          </article>
        )
      })}
    </div>
  )
}
