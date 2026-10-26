import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import CraftCards from './CraftCards'
import { toggleFavorite } from '../features/crafts/craftsSlice'

export default function CraftDiscovery({ heading = 'Discover handmade crafts', description = 'Explore listings from artisan communities across India.', limit }) {
  const crafts = useSelector(state => state.marketplace.crafts)
  const favoriteIds = useSelector(state => state.marketplace.favoriteIds)
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const category = searchParams.get('category') || 'all'
  const hasPrices = crafts.some(craft => Number.isFinite(craft.priceMin))
  const effectiveSort = !hasPrices && sort.startsWith('price-') ? 'featured' : sort
  const categories = useMemo(() => [...new Set(crafts.map(craft => craft.category).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [crafts])

  const visibleCrafts = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    const result = crafts.filter(craft => {
      const matchesSearch = !search || [craft.title, craft.description, craft.fullDescription, craft.category, craft.region, craft.material, craft.artisanName, craft.artisanSpecialty]
        .some(value => value?.toLocaleLowerCase().includes(search))
      const matchesCategory = category === 'all' || craft.category === category
      return matchesSearch && matchesCategory
    })
    return result.sort((a, b) => {
      if (effectiveSort === 'name-asc') return a.title.localeCompare(b.title)
      if (effectiveSort === 'price-asc' || effectiveSort === 'price-desc') {
        const aHasPrice = Number.isFinite(a.priceMin)
        const bHasPrice = Number.isFinite(b.priceMin)
        if (aHasPrice !== bHasPrice) return aHasPrice ? -1 : 1
        if (!aHasPrice) return 0
        return effectiveSort === 'price-asc' ? a.priceMin - b.priceMin : b.priceMin - a.priceMin
      }
      return 0
    })
  }, [crafts, query, category, effectiveSort])

  const setCategory = value => {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('category')
    else next.set('category', value)
    setSearchParams(next, { replace: true })
  }

  const shownCrafts = typeof limit === 'number' ? visibleCrafts.slice(0, limit) : visibleCrafts

  return (
    <section className="craft-discovery" aria-label="Craft listings">
      <div className="discovery-heading">
        <div><h2>{heading}</h2><p className="muted">{description}</p></div>
        <span className="listing-count">{visibleCrafts.length} {visibleCrafts.length === 1 ? 'listing' : 'listings'}</span>
      </div>
      <div className="discovery-toolbar">
        <label className="discovery-search">Search crafts
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, material, region, artisan…" />
        </label>
        <label>Category
          <select value={category} onChange={event => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map(item => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label>Sort by
          <select value={effectiveSort} onChange={event => setSort(event.target.value)}>
            <option value="featured">Featured order</option>
            <option value="name-asc">Name: A to Z</option>
            {hasPrices && <><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></>}
          </select>
        </label>
      </div>
      <CraftCards
        crafts={shownCrafts}
        clickable
        favoriteIds={favoriteIds}
        onToggleFavorite={id => dispatch(toggleFavorite(id))}
        emptyMessage="Try a different search or choose another category."
      />
    </section>
  )
}
