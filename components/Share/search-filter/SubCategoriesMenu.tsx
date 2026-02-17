import { cn } from '@/lib/utils'
import { Category } from '@/payload-types'
import Link from 'next/link'

interface SubCategoriesProps {
  isOpen: boolean
  position: { top: number; left: number }
  category: Category
}

const SubCategoriesMenu = ({ category, isOpen, position }: SubCategoriesProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="relative h-3 w-60 bg-trnasparent " />

      <div
        style={{
          backgroundColor: category.color || '#e0e0e0',
        }}
        className={`
        fixed z-100 w-60 max-h-80 overflow-auto
        rounded-xl  border-gray-200
        p-4
        shadow-neu
        border-3 border-r-black  border-b-black border-t-transparent border-l-transparent
      `}
      >
        {category.subcategories?.docs?.length
          ? (category.subcategories.docs as Category[]).map((sub) => (
              <Link
                href={`/explore/${category.slug}/${sub.slug}`}
                key={sub.id}
                className={cn(
                  `
                  block
                  underline
              p-2 mb-2 rounded-lg
              bg-neutral-800/200
              shadow-inner-neu
              hover:shadow-hover-neu
              transition-shadow duration-200
              cursor-pointer
              capitalize
              hover:bg-gray-100/70
              

            `
                )}
              >
                {sub.name}
              </Link>
            ))
          : null}
      </div>
    </div>
  )
}

export default SubCategoriesMenu
