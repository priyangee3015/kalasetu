import { useSelector } from 'react-redux'
import { selectFreelancerRating } from '../features/crafts/craftsSlice'

export default function FreelancerRatingSummary({ freelancerId }) {
  const rating = useSelector(state => selectFreelancerRating(state, freelancerId))
  if (!rating?.count || !Number.isFinite(rating.average)) return <p className="rating-empty">Not rated yet</p>
  return <p className="rating-summary" aria-label={`${rating.average.toFixed(1)} out of 5, ${rating.count} reviews`}><span aria-hidden="true">★</span> {rating.average.toFixed(1)}/5 ({rating.count} {rating.count === 1 ? 'review' : 'reviews'})</p>
}
