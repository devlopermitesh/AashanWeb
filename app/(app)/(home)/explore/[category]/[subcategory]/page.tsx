import { ProductView } from '@/modules/product/ui/view/product-view'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server'

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
    void queryClient.prefetchQuery(trpc.product.getMany.queryOptions({ category: subcategory }))
  } catch (error) {
    console.log('Product Prefetch Failed', error)
  }
  return (
    <HydrateClient>
      <ProductView category={subcategory} />
    </HydrateClient>
  )
}
export default Page
