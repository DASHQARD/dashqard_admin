// Helper cell component for nullable text fields
export function NullableTextCell({
  getValue,
}: Readonly<{ getValue: () => string | null | undefined }>) {
  const value = getValue();
  return <div>{value || '-'}</div>;
}
