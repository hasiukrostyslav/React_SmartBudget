// Mirrors getSymbolFromCurrency from currency-symbol-map — only the currencies
// the app actually uses (CURRENCIES enum) are mapped here, so we don't pull in
// the full lookup table.
const CURRENCY_SYMBOLS: Record<string, string> = {
  UAH: '₴',
  USD: '$',
  EUR: '€',
  PLN: 'zł',
  HUF: 'Ft',
  GBP: '£',
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}
