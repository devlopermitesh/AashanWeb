export interface ExploreSubcategory {
  id: string
  name: string
  slug: string
}

export interface ExploreCategory {
  id: string
  name: string
  slug: string
  color?: string | null
  subcategories?: {
    docs?: ExploreSubcategory[]
  }
}
