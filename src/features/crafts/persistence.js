import { sampleCrafts, sampleOpportunities } from './sampleData'

const STORAGE_KEY = 'kalasetu-marketplace-v1'
const SCHEMA_VERSION = 2

const freshData = () => ({
  crafts: structuredClone(sampleCrafts.map(craft => ({ ...craft, isSample: true }))),
  favoriteIds: [],
  opportunities: structuredClone(sampleOpportunities),
  interests: [],
  completedCollaborations: [],
  reviews: [],
})

function optionalNumber(value) {
  return Number.isFinite(value) && value >= 0 ? value : null
}

function cleanCraft(value) {
  if (!value || typeof value !== 'object' || typeof value.id !== 'string' || !value.id) return null
  if (typeof value.title !== 'string' || !value.title.trim() || typeof value.description !== 'string') return null
  return {
    id: value.id.slice(0, 100),
    title: value.title.trim().slice(0, 120),
    category: typeof value.category === 'string' ? value.category.trim().slice(0, 80) : 'Other crafts',
    region: typeof value.region === 'string' ? value.region.trim().slice(0, 120) : '',
    description: value.description.trim().slice(0, 1500),
    fullDescription: typeof value.fullDescription === 'string' ? value.fullDescription.slice(0, 5000) : value.description.trim().slice(0, 1500),
    material: typeof value.material === 'string' ? value.material.slice(0, 160) : '',
    priceLabel: typeof value.priceLabel === 'string' ? value.priceLabel.slice(0, 80) : '',
    priceMin: optionalNumber(value.priceMin),
    priceMax: optionalNumber(value.priceMax),
    artisanName: typeof value.artisanName === 'string' ? value.artisanName.slice(0, 120) : '',
    artisanSpecialty: typeof value.artisanSpecialty === 'string' ? value.artisanSpecialty.slice(0, 160) : '',
    artisanLocation: typeof value.artisanLocation === 'string' ? value.artisanLocation.slice(0, 160) : '',
    artisanBio: typeof value.artisanBio === 'string' ? value.artisanBio.slice(0, 1200) : '',
    image: typeof value.image === 'string' ? value.image.slice(0, 500) : '',
    isSample: Boolean(value.isSample),
  }
}

function cleanOpportunity(value) {
  if (!value || typeof value !== 'object' || typeof value.id !== 'string' || !value.id) return null
  if (typeof value.title !== 'string' || !value.title.trim() || typeof value.service !== 'string' || typeof value.requirements !== 'string') return null
  return {
    id: value.id.slice(0, 100),
    title: value.title.trim().slice(0, 140),
    service: value.service.slice(0, 100),
    requirements: value.requirements.trim().slice(0, 2500),
    budget: optionalNumber(value.budget),
    creatorName: typeof value.creatorName === 'string' ? value.creatorName.slice(0, 120) : 'Artisan',
    creatorId: typeof value.creatorId === 'string' ? value.creatorId.slice(0, 100) : '',
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date(0).toISOString(),
    status: value.status === 'Closed' ? 'Closed' : 'Open',
    isSample: Boolean(value.isSample),
  }
}

function cleanInterest(value) {
  if (!value || typeof value !== 'object' || typeof value.id !== 'string' || typeof value.opportunityId !== 'string' || typeof value.userId !== 'string') return null
  return {
    id: value.id.slice(0, 100),
    opportunityId: value.opportunityId.slice(0, 100),
    userId: value.userId.slice(0, 100),
    userName: typeof value.userName === 'string' ? value.userName.slice(0, 120) : 'Freelancer',
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date(0).toISOString(),
  }
}

function cleanCompletion(value) {
  if (!value || typeof value.opportunityId !== 'string' || typeof value.freelancerId !== 'string' || typeof value.artisanId !== 'string') return null
  return { opportunityId: value.opportunityId.slice(0, 100), freelancerId: value.freelancerId.slice(0, 100), artisanId: value.artisanId.slice(0, 100), artisanName: typeof value.artisanName === 'string' ? value.artisanName.slice(0, 120) : 'Artisan', completedAt: typeof value.completedAt === 'string' ? value.completedAt : new Date(0).toISOString() }
}

function cleanReview(value) {
  if (!value || typeof value !== 'object' || typeof value.opportunityId !== 'string' || typeof value.freelancerId !== 'string' || typeof value.reviewerId !== 'string' || !Number.isInteger(value.rating) || value.rating < 1 || value.rating > 5) return null
  return { id: typeof value.id === 'string' ? value.id.slice(0, 100) : `${value.opportunityId}-${value.freelancerId}-${value.reviewerId}`, opportunityId: value.opportunityId.slice(0, 100), freelancerId: value.freelancerId.slice(0, 100), freelancerName: typeof value.freelancerName === 'string' ? value.freelancerName.slice(0, 120) : 'Freelancer', reviewerId: value.reviewerId.slice(0, 100), reviewerName: typeof value.reviewerName === 'string' ? value.reviewerName.slice(0, 120) : 'Artisan', rating: value.rating, text: typeof value.text === 'string' ? value.text.trim().slice(0, 1000) : '', createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date(0).toISOString(), updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '' }
}

export function loadMarketplaceState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return freshData()
    const saved = JSON.parse(raw)
    const data = [1, SCHEMA_VERSION].includes(saved?.version) ? saved.data : null
    if (!data || !Array.isArray(data.crafts) || !Array.isArray(data.favoriteIds) || !Array.isArray(data.opportunities) || !Array.isArray(data.interests)) return freshData()

    const crafts = data.crafts.map(cleanCraft).filter(Boolean)
    const craftIds = new Set(crafts.map(craft => craft.id))
    const opportunities = data.opportunities.map(cleanOpportunity).filter(Boolean)
    const opportunityIds = new Set(opportunities.map(opportunity => opportunity.id))
    const interests = data.interests.map(cleanInterest).filter(interest => interest && opportunityIds.has(interest.opportunityId))
    const rawCompletions = Array.isArray(data.completedCollaborations) ? data.completedCollaborations.map(cleanCompletion).filter(item => item && opportunityIds.has(item.opportunityId) && interests.some(interest => interest.opportunityId === item.opportunityId && interest.userId === item.freelancerId)) : []
    const completions = [...new Map(rawCompletions.map(item => [`${item.opportunityId}:${item.freelancerId}`, item])).values()]
    const rawReviews = Array.isArray(data.reviews) ? data.reviews.map(cleanReview).filter(item => item && completions.some(completion => completion.opportunityId === item.opportunityId && completion.freelancerId === item.freelancerId && completion.artisanId === item.reviewerId)) : []
    const reviews = [...new Map(rawReviews.map(item => [`${item.opportunityId}:${item.freelancerId}:${item.reviewerId}`, item])).values()]
    return {
      crafts,
      favoriteIds: [...new Set(data.favoriteIds.filter(id => typeof id === 'string' && craftIds.has(id)))],
      opportunities,
      interests,
      completedCollaborations: completions,
      reviews,
    }
  } catch {
    // Corrupt JSON, disabled storage, or blocked access falls back to sample data.
    return freshData()
  }
}

export function saveMarketplaceState(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, data }))
  } catch {
    // State remains usable in memory when browser storage is full or unavailable.
  }
}
