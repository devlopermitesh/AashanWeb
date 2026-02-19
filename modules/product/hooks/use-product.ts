import { createLoader, parseAsString } from 'nuqs/server'
import { useQueryStates } from 'nuqs'

export const productFilterParams = {
  minPrice: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),

  maxPrice: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
}

// CLIENT
export const useProductFilter = () => {
  return useQueryStates(productFilterParams)
}

// SERVER
export const loadProductSearchParamsFilter = createLoader(productFilterParams)
