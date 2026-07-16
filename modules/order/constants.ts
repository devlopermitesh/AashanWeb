export const DEFAULT_QUERY_ORDER_LIMIT = 10

export const orderFilters = ['recent', 'accepted', 'cancelled', 'all'] as const
export type OrderFilter = (typeof orderFilters)[number]
