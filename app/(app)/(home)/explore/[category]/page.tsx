import type { SearchParams } from 'nuqs/server'
import { ProductList, ProductListSkeleton } from '@/modules/product/ui/product-list'
import ProductSearchFilter from '@/modules/product/ui/product-searchfilter'
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'
import { loadProductSearchParamsFilter } from '@/modules/product/hooks/use-product'

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
      <div className="px-4 lg:px-12 py-8 w-full ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Product Filter */}
          <aside className="lg:col-span-3 xl:col-span-2">
            <div className="border rounded-lg  sticky top-24">
              <ProductSearchFilter />
            </div>
          </aside>

          {/* Product List */}
          <main className="lg:col-span-9 xl:col-span-10">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </main>
        </div>
      </div>
    </HydrateClient>
  )
}
export default Page
