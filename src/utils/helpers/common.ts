import dayjs from 'dayjs';
export function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function getQueryString(obj?: Record<string, any>) {
  if (!obj || typeof obj !== 'object') return '';

  return Object.entries(obj)
    .filter(([, value]) => value != null && value !== '') // Exclude null, undefined, and empty string
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
}

export function sentenceCase(str: string) {
  return str?.replace(/\.\s+([a-z])[^\\.]|^(\s*[a-z])[^\\.]/g, (s) =>
    s.replace(/([a-z])/, (s) => s.toUpperCase())
  );
}

export function getStatusVariant(status?: string) {
  switch (status) {
    case 'active':
      return 'success';
    case 'paid':
      return 'success';
    case 'successful':
      return 'success';
    case 'approved':
      return 'success';
    case 'processing':
      return 'warning';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    case 'inactive':
      return 'error';
    case 'deactivate':
      return 'error';
    case 'deactivated':
      return 'error';
    case 'rejected':
      return 'error';
    default:
      return 'warning';
  }
}

export function formatCurrency(
  value: number,
  currency: string = 'GHS',
  fractionalDigit: number = 2,
  locale: string = 'en-GH'
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: fractionalDigit,
  });

  const formattedValue = formatter.format(value);

  const decimalPart = formattedValue.includes('.')
    ? formattedValue.split('.')[1]
    : '';
  const isDecimalZeroes = decimalPart.includes('00');

  if (isDecimalZeroes) {
    return formattedValue.split('.')[0];
  }

  return formattedValue;
}

export function formatDate(
  value: string | number,
  format = 'DD - MM - YYYY',
  userTimezone?: string
): string {
  if (!value && value !== 0) return '';

  // Parse the input as UTC (works for both strings and timestamps)
  const utcDate = dayjs.utc(value);

  if (!utcDate.isValid()) return '';

  // Convert to user timezone if provided, else use local timezone
  return userTimezone
    ? utcDate.tz(userTimezone).format(format)
    : utcDate.local().format(format);
}
