const formatters: Record<string, Intl.NumberFormat> = {}

export function formatCurrency(amount: number, currency: string = 'USD'): string {

  const locale = typeof navigator !== 'undefined' 
    ? navigator.language 
    : 'pl-PL' // fallback for SSR

  if (!formatters[`${locale}_${currency}`]) {
    formatters[`${locale}_${currency}`] = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return formatters[`${locale}_${currency}`].format(amount / 100)
}