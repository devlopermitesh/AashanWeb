interface Props {
  params: {
    category: string
    subcategory: string
  }
}
const Page = async ({ params }: Props) => {
  const { category, subcategory } = await params

  return (
    <div className="flex flex-col">
      Category{category}
      SubCategory{subcategory}
    </div>
  )
}
export default Page
