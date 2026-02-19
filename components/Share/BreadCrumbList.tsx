'use client'

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { DEFAULT_ALL_CATEGORY_SLUG } from './constant'
import { useTRPC } from '../providers/TrcpProvider'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Category } from '@/payload-types'

const BreadCrumbList = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.category.getMany.queryOptions())
  const params = useParams()

  const categoryParams = params.category as string | undefined
  const subcategoryParams = params.subcategory as string | undefined
  const activeCategory = categoryParams || DEFAULT_ALL_CATEGORY_SLUG

  const activeCategoryData = data.find((c) => c.slug === activeCategory) ?? null

  const activeCategoryName = activeCategoryData?.name ?? 'All'

  const activeSubCategoryName = subcategoryParams
    ? ((
        activeCategoryData?.subcategories?.docs?.find(
          (subcategory) => (subcategory as Category).slug === subcategoryParams
        ) as Category
      )?.name ?? null)
    : null

  return (
    <Breadcrumb className="py-3">
      <BreadcrumbList className="flex items-center gap-2 text-sm text-muted-foreground">
        {/* Category */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={`/explore/${activeCategory}`}
              className=" text-xl
                font-medium text-foreground
                hover:text-primary
                transition-colors
              "
            >
              {activeCategoryName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {activeSubCategoryName && (
          <>
            <BreadcrumbSeparator className="text-muted-foreground">/</BreadcrumbSeparator>

            {/* Subcategory (active) */}
            <BreadcrumbItem>
              <span className="text-md font-semibold text-primary">{activeSubCategoryName}</span>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadCrumbList
