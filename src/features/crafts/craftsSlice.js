import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'

const craftsSlice = createSlice({
  name: 'marketplace',
  initialState: { crafts: [], favoriteIds: [], opportunities: [], interests: [], completedCollaborations: [], reviews: [] },
  reducers: {
    addCraft: {
      reducer(state, action) {
        state.crafts.push(action.payload)
      },
      prepare(craft) {
        return { payload: { ...craft, id: nanoid(), isSample: false } }
      },
    },
    editCraft(state, action) {
      const index = state.crafts.findIndex(craft => craft.id === action.payload.id)
      if (index !== -1) state.crafts[index] = { ...action.payload, isSample: state.crafts[index].isSample }
    },
    deleteCraft(state, action) {
      state.crafts = state.crafts.filter(craft => craft.id !== action.payload)
      state.favoriteIds = state.favoriteIds.filter(id => id !== action.payload)
    },
    toggleFavorite(state, action) {
      const craftExists = state.crafts.some(craft => craft.id === action.payload)
      if (!craftExists) return
      if (state.favoriteIds.includes(action.payload)) {
        state.favoriteIds = state.favoriteIds.filter(id => id !== action.payload)
      } else {
        state.favoriteIds.push(action.payload)
      }
    },
    removeFavorite(state, action) {
      state.favoriteIds = state.favoriteIds.filter(id => id !== action.payload)
    },
    addOpportunity: {
      reducer(state, action) {
        state.opportunities.unshift(action.payload)
      },
      prepare(opportunity) {
        return {
          payload: {
            ...opportunity,
            id: nanoid(),
            createdAt: new Date().toISOString(),
            status: 'Open',
            isSample: false,
          },
        }
      },
    },
    expressInterest: {
      reducer(state, action) {
        const alreadyInterested = state.interests.some(interest => interest.opportunityId === action.payload.opportunityId && interest.userId === action.payload.userId)
        const opportunityExists = state.opportunities.some(opportunity => opportunity.id === action.payload.opportunityId && opportunity.status === 'Open')
        if (!alreadyInterested && opportunityExists) state.interests.push(action.payload)
      },
      prepare({ opportunityId, userId, userName }) {
        return { payload: { id: nanoid(), opportunityId, userId, userName, createdAt: new Date().toISOString() } }
      },
    },
    completeCollaboration(state, action) {
      const { opportunityId, freelancerId, artisanId, artisanName } = action.payload
      const opportunity = state.opportunities.find(item => item.id === opportunityId)
      const hasInterest = state.interests.some(item => item.opportunityId === opportunityId && item.userId === freelancerId)
      if (!opportunity || opportunity.creatorId !== artisanId || !hasInterest || freelancerId === artisanId) return
      const existing = state.completedCollaborations.find(item => item.opportunityId === opportunityId && item.freelancerId === freelancerId)
      if (!existing) state.completedCollaborations.push({ opportunityId, freelancerId, artisanId, artisanName, completedAt: new Date().toISOString() })
    },
    submitFreelancerReview(state, action) {
      const review = action.payload
      const isCompleted = state.completedCollaborations.some(item => item.opportunityId === review.opportunityId && item.freelancerId === review.freelancerId && item.artisanId === review.reviewerId)
      if (!isCompleted || review.reviewerId === review.freelancerId || !Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) return
      const existing = state.reviews.find(item => item.opportunityId === review.opportunityId && item.freelancerId === review.freelancerId && item.reviewerId === review.reviewerId)
      if (existing) Object.assign(existing, review)
      else state.reviews.push({ ...review, id: nanoid(), createdAt: new Date().toISOString() })
    },
  },
})

export const { addCraft, editCraft, deleteCraft, toggleFavorite, removeFavorite, addOpportunity, expressInterest, completeCollaboration, submitFreelancerReview } = craftsSlice.actions
export const selectCrafts = state => state.marketplace.crafts
export const selectCraftById = (state, id) => state.marketplace.crafts.find(craft => craft.id === id)
export const selectFavorites = createSelector(
  [selectCrafts, state => state.marketplace.favoriteIds],
  (crafts, favoriteIds) => crafts.filter(craft => favoriteIds.includes(craft.id)),
)
export const selectIsFavorite = (state, id) => state.marketplace.favoriteIds.includes(id)
export const selectOpportunities = state => state.marketplace.opportunities
export const selectInterestsForOpportunity = createSelector(
  [state => state.marketplace.interests, (state, id) => id],
  (interests, id) => interests.filter(interest => interest.opportunityId === id),
)
export const selectHasExpressedInterest = (state, opportunityId, userId) => state.marketplace.interests.some(interest => interest.opportunityId === opportunityId && interest.userId === userId)
export const selectReviewsForFreelancer = createSelector(
  [state => state.marketplace.reviews, (state, freelancerId) => freelancerId],
  (reviews, freelancerId) => reviews.filter(review => review.freelancerId === freelancerId),
)
export const selectFreelancerRating = createSelector(
  [selectReviewsForFreelancer],
  reviews => ({ count: reviews.length, average: reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : null }),
)
export default craftsSlice.reducer
