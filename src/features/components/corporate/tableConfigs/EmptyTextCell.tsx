export function EmptyTextCell({
  getValue,
}: Readonly<{ getValue: () => string | null | undefined }>) {
  const value = getValue();
  const text =
    value == null || String(value).trim() === '' ? '--' : String(value);
  return <div>{text}</div>;
}
