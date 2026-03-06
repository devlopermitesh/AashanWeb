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

const formatSlugLabel = (slug: string): string =>
  decodeURIComponent(slug)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const BreadCrumbList = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.category.getMany.queryOptions())
  const params = useParams()

  const categoryParams = params.category as string | undefined
  const subcategoryParams = params.subcategory as string | undefined
  const shopcategoryParams = params.shopcategory as string | undefined
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
  const activeShopCategoryName = shopcategoryParams ? formatSlugLabel(shopcategoryParams) : null

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

            {/* Subcategory */}
            <BreadcrumbItem>
              {activeShopCategoryName ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={`/explore/${activeCategory}/${subcategoryParams}`}
                    className="text-md font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {activeSubCategoryName}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-md font-semibold text-primary">{activeSubCategoryName}</span>
              )}
            </BreadcrumbItem>
          </>
        )}

        {activeShopCategoryName && (
          <>
            <BreadcrumbSeparator className="text-muted-foreground">/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="text-md font-semibold text-primary">{activeShopCategoryName}</span>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadCrumbList
