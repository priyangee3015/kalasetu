import { useSelector } from 'react-redux'
import { selectReviewsForFreelancer } from '../features/crafts/craftsSlice'

export default function FreelancerReviews({ freelancerId }) {
  const reviews = useSelector(state => selectReviewsForFreelancer(state, freelancerId))
  if (!reviews.length) return <div className="empty-review-state"><strong>No reviews to display</strong><p>Reviews become available after an artisan records a completed collaboration and submits a rating.</p></div>
  return <ul className="review-list">{reviews.map(review => <li key={review.id}>
    <p className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} <span>{review.rating}/5</span></p>
    {review.text && <p>{review.text}</p>}
    <p className="muted">By {review.reviewerName || 'Kalasetu member'}{review.updatedAt ? ' · edited' : ''}</p>
  </li>)}</ul>
}
