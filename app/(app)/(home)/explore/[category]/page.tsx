import type { SearchParams } from 'nuqs/server'
import { ProductList, ProductListSkeleton } from '@/modules/product/ui/product-list'
import ProductSearchFilter from '@/modules/product/ui/product-searchfilter'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'
import { loadProductSearchParamsFilter } from '@/modules/product/hooks/use-product'
import ProductSort from '@/modules/product/ui/product-sort'
import { ProductView } from '@/modules/product/ui/view/product-view'

interface Props {
  params: {
    category: string
  }
  searchParams: Promise<SearchParams>
}
const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params
  const filters = loadProductSearchParamsFilter(await searchParams)
  const queryClient = getQueryClient()
  try {
    void queryClient.prefetchQuery(trpc.product.getMany.queryOptions({ category, ...filters }))
  } catch (error) {
    console.log('Product Prefetch Failed', error)
  }
  return (
    <HydrateClient>
      <ProductView category={category} />
    </HydrateClient>
  )
}
export default Page
