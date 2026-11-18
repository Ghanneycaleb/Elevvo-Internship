const wholeCediFormatter = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  maximumFractionDigits: 0,
})

const preciseCediFormatter = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
})

const compactCediFormatter = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCedis(amount) {
  return wholeCediFormatter.format(amount)
}

export function formatCedisPrecisely(amount) {
  return preciseCediFormatter.format(amount)
}

export function formatCompactCedis(amount) {
  return compactCediFormatter.format(amount)
}
