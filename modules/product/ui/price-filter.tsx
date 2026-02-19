'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  maxPrice?: string | null
  minPrice?: string | null
  onMaxPriceChange: (value: string) => void //onchange update maxprice
  onMinPriceChange: (value: string) => void //onchange update minprice
}
export const formatCurrency = (value: string) => {
  const numeric = value.replace(/[^0-9.]/g, '') //Replace any non numberic value to ""
  const parts = numeric.split('.') //parts in fractiion and intergers
  const formatedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '') //2.3 to 2+.3=>2.3
  if (!formatedValue) return ''
  const formatedfloatValue = parseFloat(formatedValue)
  if (isNaN(formatedfloatValue)) return ''
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return formatter.format(formatedfloatValue)
}
const PriceFilter = ({ onMaxPriceChange, onMinPriceChange, maxPrice, minPrice }: Props) => {
  const handleMaxPriceChange = (value: string) => {
    value = value.replace(/[^0-9.]/g, '') //Replace any non numberic value to ""
    onMaxPriceChange(value)
  }
  const handleMinPriceChange = (value: string) => {
    value = value.replace(/[^0-9.]/g, '')
    onMinPriceChange(value)
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <Label className="text-md font-medium">Min Price</Label>
        <Input
          maxLength={10}
          onChange={(e) => handleMinPriceChange(e.target.value)}
          type="text"
          value={minPrice ? formatCurrency(minPrice) : ''}
          placeholder="Add minimium Price "
        />
      </div>

      <div className="flex flex-col">
        <Label className="text-md font-medium">Max Price</Label>
        <Input
          maxLength={10}
          onChange={(e) => handleMaxPriceChange(e.target.value)}
          type="text"
          value={maxPrice ? formatCurrency(maxPrice) : ''}
          placeholder="Add maximium Price "
        />
      </div>
    </div>
  )
}
export default PriceFilter
