const LOWERCASE_VALUE_LABELS = new Set([
  'Email',
  'Corporate Email',
  'Business Email',
]);

const CAPITALIZE_VALUE_LABELS = new Set([
  'User Type',
  'Vendor Status',
  'Onboarding Stage',
  'Approval Status',
  'Account Status',
  'Relationship Type',
  'Business Type',
  'Status',
]);

export function formatProfileFieldValue(label: string, value: string): string {
  if (!value || value === '-') return value;

  if (LOWERCASE_VALUE_LABELS.has(label)) {
    return value.toLowerCase();
  }

  return value;
}

export function getProfileFieldValueClassName(label: string): string {
  return CAPITALIZE_VALUE_LABELS.has(label)
    ? 'wrap-break-word capitalize'
    : 'wrap-break-word';
}
