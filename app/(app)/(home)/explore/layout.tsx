// app/(app)/(home)/explore/layout.tsx
import SearchFilter from '@/components/Share/search-filter'
import { getQueryClient, trpc } from '@/trpc/server'

export const dynamic = 'force-dynamic'

export default async function ExploreLayout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  // ✅ Shared prefetch for all explore pages
  try {
    void queryClient.prefetchQuery(trpc.category.getMany.queryOptions())
  } catch (error) {
    console.error('Prefetch failed:', error)
  }

  return (
    <div className="flex flex-col bg-white w-full">
      <SearchFilter />
      <div className="flex-1 bg-blue-100">{children}</div>
    </div>
  )
}
