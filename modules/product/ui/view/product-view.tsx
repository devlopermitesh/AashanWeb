import { Suspense } from 'react'
import ProductSearchFilter from '../product-searchfilter'
import ProductSort from '../product-sort'
import { ProductList, ProductListSkeleton } from '../product-list'

export const ProductView = ({ category }: { category: string }) => {
  return (
    <div className="px-4 lg:px-12 py-8 w-full flex flex-col ">
      {/* sort filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-2 lg:gap-y-0 my-2">
        <p className="font-medium text-xl capitalize italic lg:text-2xl">Curated for you</p>
        <ProductSort />
      </div>
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
  )
}
