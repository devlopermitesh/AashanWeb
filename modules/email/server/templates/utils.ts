const HTML_ESCAPE_RE = /[&<>"']/g

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(HTML_ESCAPE_RE, (ch) => HTML_ESCAPE_MAP[ch] || ch)

export const formatINR = (amount: unknown): string => {
  const numeric = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(numeric)
}

export const formatDateTime = (value: unknown): string => {
  const date = value instanceof Date ? value : new Date(String(value ?? ''))
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
