export const DEFAULT_ALL_CATEGORY_SLUG = 'all'
export const DEFAULT_QUERY_TAGS_LIMIT = 10
export const DEFAULT_QUERY_PRODUCT_LIMIT = 20
export const sorted = ['trending', 'latest', 'price-desc', 'price-asc'] as const
export type SortType = (typeof sorted)[number]
