import { escapeHtml, formatDateTime, formatINR } from './utils'

type OrderItemLike = {
  quantity?: number | null
  amount?: number | null
  product?: { name?: string | null } | string | null
}

type OrderLike = {
  id: string
  orderNumber?: number | null
  createdAt?: string | null
  customerName?: string | null
  customerPhone?: string | null
  deliveryLocation?: string | null
  instructions?: string | null
  totalAmount?: number | null
  items?: OrderItemLike[] | null
  tenant?: { name?: string | null } | string | null
}

export function buildShopOwnerOrderEmail(args: { order: OrderLike }) {
  const { order } = args
  const orderLabel = order.orderNumber ? `#${order.orderNumber}` : order.id
  const shopName =
    typeof order.tenant === 'object' && order.tenant && 'name' in order.tenant
      ? order.tenant.name
      : ''

  const items = (order.items || [])
    .map((item) => {
      const productName =
        typeof item.product === 'object' && item.product && 'name' in item.product
          ? item.product.name
          : typeof item.product === 'string'
            ? item.product
            : 'Item'
      return `<tr>
  <td style="padding:6px 0;">${escapeHtml(productName)}</td>
  <td style="padding:6px 0; text-align:right;">${escapeHtml(item.quantity ?? '')}</td>
  <td style="padding:6px 0; text-align:right;">${escapeHtml(formatINR(item.amount))}</td>
</tr>`
    })
    .join('')

  const subject = `New paid order ${orderLabel}${shopName ? ` · ${shopName}` : ''}`

  const html = `<!doctype html>
<html>
  <body style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5; color:#111827;">
    <div style="max-width:720px; margin:0 auto; padding:24px;">
      <h1 style="margin:0 0 10px; font-size:18px;">New paid order ${escapeHtml(orderLabel)}</h1>
      <p style="margin:0 0 12px; color:#374151;">
        Customer: <strong>${escapeHtml(order.customerName || '')}</strong>${
          order.customerPhone ? ` (${escapeHtml(order.customerPhone)})` : ''
        }
      </p>
      <p style="margin:0 0 12px; color:#374151;">
        Placed: ${escapeHtml(formatDateTime(order.createdAt))}
      </p>
      ${order.deliveryLocation ? `<p style="margin:0 0 12px; color:#374151;">Delivery: ${escapeHtml(order.deliveryLocation)}</p>` : ''}
      ${order.instructions ? `<p style="margin:0 0 12px; color:#374151;">Instructions: ${escapeHtml(order.instructions)}</p>` : ''}
      <table style="width:100%; border-collapse:collapse; font-size:14px; margin-top:12px;">
        <thead>
          <tr>
            <th style="text-align:left; padding:6px 0; border-bottom:1px solid #f3f4f6;">Item</th>
            <th style="text-align:right; padding:6px 0; border-bottom:1px solid #f3f4f6;">Qty</th>
            <th style="text-align:right; padding:6px 0; border-bottom:1px solid #f3f4f6;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items || ''}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:10px 0; text-align:right; font-weight:700;">Total</td>
            <td style="padding:10px 0; text-align:right; font-weight:700;">${escapeHtml(
              formatINR(order.totalAmount)
            )}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </body>
</html>`

  const textLines: string[] = []
  textLines.push(`New paid order ${orderLabel}`)
  if (shopName) textLines.push(`Shop: ${shopName}`)
  if (order.customerName) textLines.push(`Customer: ${order.customerName}`)
  if (order.customerPhone) textLines.push(`Phone: ${order.customerPhone}`)
  if (order.deliveryLocation) textLines.push(`Delivery: ${order.deliveryLocation}`)
  if (order.instructions) textLines.push(`Instructions: ${order.instructions}`)
  textLines.push('')
  for (const item of order.items || []) {
    const productName =
      typeof item.product === 'object' && item.product && 'name' in item.product
        ? item.product.name
        : typeof item.product === 'string'
          ? item.product
          : 'Item'
    textLines.push(`- ${productName} x${item.quantity ?? ''}: ${formatINR(item.amount)}`)
  }
  textLines.push(`Total: ${formatINR(order.totalAmount)}`)

  const text = textLines.filter(Boolean).join('\n')
  return { subject, html, text }
}
