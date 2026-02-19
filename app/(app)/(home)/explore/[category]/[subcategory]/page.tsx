import { ProductList, ProductListSkeleton } from '@/modules/product/ui/product-list'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'

interface Props {
  params: {
    category: string
    subcategory: string
  }
}

const Page = async ({ params }: Props) => {
  const { subcategory } = await params
  const queryClient = getQueryClient()
  try {
    void queryClient.prefetchQuery(trpc.product.getMany.queryOptions({}))
  } catch (error) {
    console.log('Product Prefetch Failed', error)
  }
  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrateClient>
  )
}
export default Page
