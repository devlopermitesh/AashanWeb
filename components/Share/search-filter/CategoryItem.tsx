'use client'
import { Button } from '@/components/ui/button'
import useDropDirection from '@/hooks/use-Dropdirection'
import { Category } from '@/payload-types'
import { useRef, useState } from 'react'
import SubCategoriesMenu from './SubCategoriesMenu'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const CategoryItem = ({
  category,
  ActiveCategory,
}: {
  category: Category
  ActiveCategory: string
}) => {
  const [isOpen, setOpen] = useState(false)
  const DropItemRef = useRef<HTMLDivElement>(null)
  const position = useDropDirection(DropItemRef)
  const MouseEnter = () => {
    if (category.subcategories) {
      setOpen(true)
    }
  }
  const MouseLeave = () => setOpen(false)
  return (
    <div className="relative" ref={DropItemRef} onMouseEnter={MouseEnter} onMouseLeave={MouseLeave}>
      <div className="relative">
        <Button
          variant={'reverse'}
          style={{ backgroundColor: `${category.color}` }}
          className={cn(ActiveCategory === category.slug && 'border-dotted shadow-shadow ')}
        >
          <Link href={`/explore/${category.slug}`}>{category.name}</Link>
        </Button>
      </div>
      {/* //Bottom Cap point */}
      {category.subcategories?.docs && category.subcategories.docs.length > 0 && isOpen && (
        <>
          <div className="absolute left-1/4 -translate-x-1/2 w-0 h-0 border-b-black border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px]" />

          <SubCategoriesMenu isOpen={isOpen} category={category} position={position} />
        </>
      )}
    </div>
  )
}
export default CategoryItem
