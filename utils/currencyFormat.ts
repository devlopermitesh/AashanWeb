export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const formatCurrency = (value: string): string => {
  const numeric = value.replace(/[^0-9.]/g, '')
  const parts = numeric.split('.')

  const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1].slice(0, 2) : '')

  if (!formattedValue) return ''

  const numericValue = Number.parseFloat(formattedValue)

  if (Number.isNaN(numericValue)) return ''

  return currencyFormatter.format(numericValue)
}
