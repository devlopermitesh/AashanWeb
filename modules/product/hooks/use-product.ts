import { parseAsArrayOf, createLoader, parseAsString, parseAsStringLiteral } from 'nuqs/server'
import { useQueryStates } from 'nuqs'
import { sorted } from '@/components/Share/constant'

export const productFilterParams = {
  sort: parseAsStringLiteral(sorted).withDefault('trending').withOptions({ clearOnDefault: true }),
  minPrice: parseAsString.withDefault('').withOptions({ clearOnDefault: true, shallow: false }),
  maxPrice: parseAsString.withDefault('').withOptions({ clearOnDefault: true, shallow: false }),
  tags: parseAsArrayOf(parseAsString).withDefault([]).withOptions({ clearOnDefault: true }),
}

// CLIENT
export const useProductFilter = () => {
  return useQueryStates(productFilterParams)
}

// SERVER
export const loadProductSearchParamsFilter = createLoader(productFilterParams)
