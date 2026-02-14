// app/(app)/(home)/explore/page.tsx
import SearchFilter from '@/components/Share/search-filter'
import { getQueryClient, trpc } from '@/trpc/server'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const queryClient = getQueryClient()

  // ✅ Prefetch with error handling
  try {
    void queryClient.prefetchQuery(trpc.category.getMany.queryOptions())
  } catch (error) {
    // Silently fail - client will fetch instead
    console.error('Prefetch failed:', error)
  }

  return (
    <div className="flex flex-col h-auto lg:h-32 bg-white w-full">
      <SearchFilter />
    </div>
  )
}
