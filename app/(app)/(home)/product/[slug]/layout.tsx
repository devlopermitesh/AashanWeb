import React from 'react'
interface Props {
  children: React.ReactNode
}

const ProductLayout = ({ children }: Props) => {
  return <div className="min-h-screen w-full bg-[#f4f4f4]">{children}</div>
}
export default ProductLayout
