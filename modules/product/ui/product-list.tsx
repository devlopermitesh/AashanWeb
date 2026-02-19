'use client'

import { useTRPC } from '@/components/providers/TrcpProvider'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useProductFilter } from '../hooks/use-product'

export const ProductList = ({ category }: { category?: string }) => {
  const trpc = useTRPC()
  const [filters] = useProductFilter()
  const { data } = useSuspenseQuery(trpc.product.getMany.queryOptions({ category, ...filters }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.docs.map((product) => (
        <div key={product.id} className="p-3 flex flex-col bg-white border rounded">
          <h2 className="font-medium">{product.name}</h2>
          <p className="text-sm text-gray-600">₹{product.price}</p>
        </div>
      ))}
    </div>
  )
}

export const ProductListSkeleton = () => {
  return <div className="flex w-full flex-col">loading...</div>
}
