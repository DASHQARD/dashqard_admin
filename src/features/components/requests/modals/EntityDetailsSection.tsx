import { Text } from '@/components';
import { formatDate } from '@/utils/helpers';

function formatLabel(key: string): string {
  return key.replace(/_/g, ' ');
}

const HIDDEN_ENTITY_FIELDS = new Set([
  'id',
  'user_id',
  'vendor_id',
  'entity_id',
  'file_key',
]);

function isHiddenEntityField(key: string): boolean {
  const normalized = key.toLowerCase().replace(/\s+/g, '_');
  return HIDDEN_ENTITY_FIELDS.has(normalized);
}

function formatFieldValue(key: string, value: unknown): string {
  if (value == null) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (key.includes('_at') && typeof value === 'string') {
    return formatDate(value, 'DD MMM YYYY, HH:mm');
  }
  if (key.includes('date') && typeof value === 'string') {
    return formatDate(value, 'DD MMM YYYY, HH:mm');
  }
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.length === 0 ? '-' : `${value.length} item(s)`;
    }
    const parts = Object.entries(value as Record<string, unknown>)
      .filter(([k, v]) => !isHiddenEntityField(k) && v != null && v !== '')
      .map(([k, v]) => `${formatLabel(k)}: ${formatFieldValue(k, v)}`);
    return parts.length > 0 ? parts.join(' · ') : '-';
  }
  return String(value);
}

type ImageRecord = {
  file_url?: string;
  file_name?: string;
};

function EntityImages({ images }: { images: unknown[] }) {
  const items = images.filter(
    (item): item is ImageRecord =>
      typeof item === 'object' &&
      item !== null &&
      Boolean((item as ImageRecord).file_url)
  );
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-gray-500 text-xs font-medium">Images</p>
      <div className="flex flex-wrap gap-3">
        {items.map((image, index) => (
          <a
            key={image.file_url ?? index}
            href={image.file_url}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <img
              src={image.file_url}
              alt={image.file_name ?? 'Card image'}
              className="h-20 w-20 rounded-md border border-gray-200 object-cover"
            />
            {image.file_name ? (
              <p className="mt-1 max-w-[5rem] truncate text-xs text-gray-500">
                {image.file_name}
              </p>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
}

type Props = {
  entityDetails: Record<string, unknown>;
};

export function EntityDetailsSection({ entityDetails }: Props) {
  const entries = Object.entries(entityDetails).filter(
    ([key]) => !isHiddenEntityField(key)
  );
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-gray-200 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-gray-600 text-sm font-medium pb-2 border-b border-gray-200">
        Entity Details
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entries.map(([key, value]) => {
          if (key === 'images' && Array.isArray(value)) {
            return (
              <div key={key} className="sm:col-span-2">
                <EntityImages images={value} />
              </div>
            );
          }

          const label = formatLabel(key);
          if (value == null) {
            return (
              <div key={key} className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs capitalize">{label}</p>
                <Text
                  variant="span"
                  weight="normal"
                  className="text-gray-800 text-sm"
                >
                  -
                </Text>
              </div>
            );
          }
          if (typeof value === 'object' && !Array.isArray(value)) {
            const nested = Object.entries(
              value as Record<string, unknown>
            ).filter(([nestedKey]) => !isHiddenEntityField(nestedKey));
            if (nested.length === 0) return null;
            return (
              <div key={key} className="sm:col-span-2">
                <p className="text-gray-500 text-xs font-medium mb-2 capitalize">
                  {label}
                </p>
                <div className="grid grid-cols-2 gap-3 pl-3 border-l-2 border-gray-200">
                  {nested.map(([nestedKey, nestedValue]) => (
                    <div key={nestedKey} className="flex flex-col gap-1">
                      <p className="text-gray-400 text-xs capitalize">
                        {formatLabel(nestedKey)}
                      </p>
                      <Text
                        variant="span"
                        weight="normal"
                        className="text-gray-800 text-sm break-all"
                      >
                        {formatFieldValue(nestedKey, nestedValue)}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={key} className="flex flex-col gap-1">
              <p className="text-gray-400 text-xs capitalize">{label}</p>
              <Text
                variant="span"
                weight="normal"
                className="text-gray-800 text-sm break-all"
              >
                {formatFieldValue(key, value)}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
