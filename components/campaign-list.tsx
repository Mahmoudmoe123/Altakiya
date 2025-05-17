import { createClient } from "@/lib/supabase/server"

export default async function CampaignList({
  searchQuery,
  categoryFilter,
  locationFilter,
  sortOption,
}: {
  searchQuery?: string
  categoryFilter?: string
  locationFilter?: string
  sortOption?: string
}) {
  const supabase = createClient()
  
  // Build query
  let query = supabase
    .from('campaigns')
    .select(`
      *,
      campaign_images!inner(*)
    `)
    .eq('status', 'active')
    .eq('campaign_images.is_primary', true)

  // Apply filters
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
  }

  if (categoryFilter) {
    const categories = categoryFilter.split(',')
    query = query.in('category', categories)
  }

  if (locationFilter) {
    const locations = locationFilter.split(',')
    query = query.or(locations.map(loc => `location.ilike.%${loc}%`).join(','))
  }

  // Apply sorting
  if (sortOption) {
    switch (sortOption) {
      case 'ending-soon':
        query = query.order('end_date', { ascending: true })
        break
      case 'most-funded':
        query = query.order('raised', { ascending: false })
        break
      case 'most-popular':
        // This is a simplification - ideally we'd calculate popularity based on donations/views
        break
    }
  }
