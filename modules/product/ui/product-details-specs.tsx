import { cn } from '@/lib/utils'

interface ProductDetailsSpecsProps {
  description: string
  productId: string
  categoryLabel: string
  refundPolicy: string
  inStock: boolean
  stockCount: number
  tags: string[]
}

export const ProductDetailsSpecs = ({
  description,
  productId,
  categoryLabel,
  refundPolicy,
  inStock,
  stockCount,
  tags,
}: ProductDetailsSpecsProps) => {
  return (
    <section className="mt-10 border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
      <h2 className="mb-4 text-2xl font-black">Details</h2>
      <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-700">
        {description || 'No description available for this product yet.'}
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="border-2 border-black bg-zinc-50 p-3">
          <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Category</p>
          <p className="mt-1 text-sm font-semibold">{categoryLabel || 'General'}</p>
        </div>
        <div className="border-2 border-black bg-zinc-50 p-3">
          <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Refund Policy</p>
          <p className="mt-1 text-sm font-semibold">{refundPolicy}</p>
        </div>
        <div className="border-2 border-black bg-zinc-50 p-3">
          <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Availability</p>
          <p className="mt-1 text-sm font-semibold">
            {inStock ? `${stockCount > 0 ? stockCount : 'Limited'} in stock` : 'Out of stock'}
          </p>
        </div>
        <div className="border-2 border-black bg-zinc-50 p-3">
          <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Product Code</p>
          <p className="mt-1 text-sm font-semibold uppercase">{productId.slice(0, 8)}</p>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-zinc-500">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  'inline-flex border-2 border-black bg-[#fff2d8] px-2 py-0.5 text-xs font-bold uppercase'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
