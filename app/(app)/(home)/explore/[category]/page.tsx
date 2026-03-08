import type { SearchParams } from 'nuqs/server'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server'
import { loadProductSearchParamsFilter } from '@/modules/product/hooks/use-product'
import { ProductView } from '@/modules/product/ui/view/product-view'

interface Props {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<SearchParams>
}
const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params
  const SearchCategory = category === 'all' ? undefined : category
  const filters = loadProductSearchParamsFilter(await searchParams)
  const queryClient = getQueryClient()
  try {
    void queryClient.prefetchQuery(
      trpc.product.getMany.queryOptions({ category: SearchCategory, ...filters })
    )
  } catch (error) {
    console.log('Product Prefetch Failed', error)
  }
  return (
    <HydrateClient>
      <ProductView category={SearchCategory} />
    </HydrateClient>
  )
}
export default Page
