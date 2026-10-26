import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { submitFreelancerReview } from '../features/crafts/craftsSlice'

export default function FreelancerReviewForm({ opportunity, freelancer, reviewer, existingReview }) {
  const dispatch = useDispatch()
  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState(existingReview?.text ?? '')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saved, setSaved] = useState(Boolean(existingReview))

  const chooseRating = value => { setRating(value); setError(''); setFeedback('') }
  const handleKeyDown = (event, value) => {
    const next = { ArrowRight: Math.min(5, value + 1), ArrowUp: Math.min(5, value + 1), ArrowLeft: Math.max(1, value - 1), ArrowDown: Math.max(1, value - 1), Home: 1, End: 5 }[event.key]
    if (next) { event.preventDefault(); chooseRating(next); event.currentTarget.parentElement.querySelector(`[data-rating="${next}"]`)?.focus() }
  }
  const handleSubmit = event => {
    event.preventDefault()
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) { setError('Select a rating from 1 to 5 stars before submitting.'); return }
    dispatch(submitFreelancerReview({ opportunityId: opportunity.id, freelancerId: freelancer.userId, freelancerName: freelancer.userName, reviewerId: reviewer.id, reviewerName: reviewer.name, rating, text: text.trim() }))
    setError('')
    setSaved(true)
    setFeedback(existingReview ? 'Your review was updated.' : 'Your review was saved in this browser.')
  }

  return <form className="review-form" onSubmit={handleSubmit} noValidate>
    <fieldset>
      <legend>{existingReview ? 'Edit your review' : 'Rate this freelancer'}</legend>
      <div className="star-picker" role="radiogroup" aria-label="Rating from 1 to 5 stars" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map(value => <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} className={`star-choice${(hoverRating || rating) >= value ? ' is-active' : ''}`} data-rating={value} tabIndex={rating === value || (!rating && value === 1) ? 0 : -1} onMouseEnter={() => setHoverRating(value)} onFocus={() => setHoverRating(value)} onBlur={() => setHoverRating(0)} onClick={() => chooseRating(value)} onKeyDown={event => handleKeyDown(event, value)}>★</button>)}
      </div>
      <label className="sr-only" htmlFor={`review-text-${opportunity.id}-${freelancer.userId}`}>Optional written review</label>
      <textarea id={`review-text-${opportunity.id}-${freelancer.userId}`} value={text} maxLength={1000} onChange={event => setText(event.target.value)} placeholder="Optional: share a few helpful details" rows="3" />
      <span className="review-character-count">{text.length}/1000</span>
      {error && <p className="field-error" role="alert">{error}</p>}
      {feedback && <p className="success-message" role="status">{feedback}</p>}
      <button className="btn btn-outline" type="submit">{saved ? 'Update review' : 'Submit rating'}</button>
    </fieldset>
  </form>
}
