import ProductDetails from '@/modules/product/ui/view/product-detail'
import { caller } from '@/trpc/server'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    slug: string
  }>
}

const Page = async ({ params }: Props) => {
  const { slug } = await params

  try {
    const product = await caller.product.getOne({ slug })
    if (!product) {
      notFound()
    }

    return <ProductDetails product={product} />
  } catch (error) {
    console.error('Failed to load product details page', error)
    notFound()
  }

  return null
}

export default Page
