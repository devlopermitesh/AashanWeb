import { escapeHtml, formatDateTime, formatINR } from './utils'

type OrderItemLike = {
  quantity?: number | null
  amount?: number | null
  product?: { name?: string | null } | string | null
}

type DeliveryLocationLike = string | { address?: string | null } | null

type OrderLike = {
  id: string
  orderNumber?: number | null
  createdAt?: string | null
  customerName?: string | null
  customerPhone?: string | null
  billingAddress?: string | null
  deliveryLocation?: DeliveryLocationLike
  instructions?: string | null
  totalAmount?: number | null
  items?: OrderItemLike[] | null
  tenant?: { name?: string | null } | string | null
}

export function buildCustomerOrderEmail(args: {
  orders: OrderLike[]
  customerEmail: string
  receiptUrl?: string
  serverUrl?: string
}) {
  const { orders, receiptUrl, serverUrl } = args
  const orderRows = orders
    .map((order) => {
      const orderLabel = order.orderNumber ? `#${order.orderNumber}` : order.id
      const shopName =
        typeof order.tenant === 'object' && order.tenant && 'name' in order.tenant
          ? order.tenant.name
          : undefined

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

      return `<div style="margin:18px 0; padding:14px; border:1px solid #e5e7eb; border-radius:10px;">
  <div style="font-weight:700; margin-bottom:8px;">
    Order ${escapeHtml(orderLabel)}${shopName ? ` · ${escapeHtml(shopName)}` : ''}
  </div>
  <div style="color:#6b7280; font-size:13px; margin-bottom:10px;">
    Placed: ${escapeHtml(formatDateTime(order.createdAt))}
  </div>
  <table style="width:100%; border-collapse:collapse; font-size:14px;">
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
</div>`
    })
    .join('')

  const grandTotal = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  const subject = orders.length === 1 ? 'Order confirmed' : `Orders confirmed (${orders.length})`

  const html = `<!doctype html>
<html>
  <body style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5; color:#111827;">
    <div style="max-width:720px; margin:0 auto; padding:24px;">
      <h1 style="margin:0 0 10px; font-size:20px;">Thanks for your purchase</h1>
      <p style="margin:0 0 18px; color:#374151;">
        Your payment was received successfully. Total: <strong>${escapeHtml(formatINR(grandTotal))}</strong>
      </p>
      ${receiptUrl ? `<p style="margin:0 0 18px;"><a href="${escapeHtml(receiptUrl)}">View Stripe receipt</a></p>` : ''}
      ${orderRows}
      ${
        serverUrl
          ? `<p style="margin:18px 0 0; color:#6b7280; font-size:12px;">Need help? Reply to this email or visit ${escapeHtml(
              serverUrl
            )}.</p>`
          : ''
      }
    </div>
  </body>
</html>`

  const textParts: string[] = [
    'Thanks for your purchase.',
    `Total: ${formatINR(grandTotal)}`,
    receiptUrl ? `Stripe receipt: ${receiptUrl}` : '',
    '',
    ...orders.flatMap((order) => {
      const orderLabel = order.orderNumber ? `#${order.orderNumber}` : order.id
      const lines: string[] = []
      lines.push(`Order ${orderLabel}`)
      for (const item of order.items || []) {
        const productName =
          typeof item.product === 'object' && item.product && 'name' in item.product
            ? item.product.name
            : typeof item.product === 'string'
              ? item.product
              : 'Item'
        lines.push(`- ${productName} x${item.quantity ?? ''}: ${formatINR(item.amount)}`)
      }
      lines.push(`Total: ${formatINR(order.totalAmount)}`)
      lines.push('')
      return lines
    }),
  ]

  const text = textParts.filter(Boolean).join('\n')

  return { subject, html, text }
}
