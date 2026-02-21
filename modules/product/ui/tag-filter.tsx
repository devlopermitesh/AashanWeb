'use client'

import { useTRPC } from '@/components/providers/TrcpProvider'
import { DEFAULT_QUERY_TAGS_LIMIT } from '@/components/Share/constant'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

interface TagsfilterProps {
  value?: string[]
  onChange?: (tags: string[]) => void
}
const Tagsfilter = (props: TagsfilterProps) => {
  const trcp = useTRPC()
  const { data, isLoading, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    trcp.tag.getMany.infiniteQueryOptions(
      { limit: DEFAULT_QUERY_TAGS_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  )
  const isChecked = (tag: string) => !!props.value?.includes(tag)
  const handleonChange = (tag: string, checked: boolean) => {
    if (!checked) {
      props.onChange?.(props.value?.filter((t) => t !== tag) || [])
    } else {
      props.onChange?.([...(props.value || []), tag])
    }
  }

  return (
    <div className="flex flex-col">
      {isLoading ? <Loader2 className="animate-spin mx-auto" /> : null}
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="flex flex-col gap-2">
          {page.items.map((tag) => (
            <Label key={tag.id} className="flex items-center gap-2 justify-between my-0.5">
              {tag.name}
              <Checkbox
                checked={isChecked(tag.name)}
                onCheckedChange={(checked) => handleonChange(tag.name, Boolean(checked))}
              />
            </Label>
          ))}
        </div>
      ))}
      {/* Next Pages load button */}
      {data?.pages[data.pages.length - 1].nextCursor && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="cursor-pointer underline text-center block"
        >
          Load mores...
        </button>
      )}
    </div>
  )
}
export default Tagsfilter
