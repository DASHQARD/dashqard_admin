import { Button } from '@/components';

type Props = Readonly<{
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  next: string | null;
  previous: string | null;
  onNext: () => void;
  onPrevious: () => void;
}>;

export function Pagination({
  hasNextPage,
  hasPreviousPage,
  onNext,
  onPrevious,
}: Props) {
  return (
    <div className="flex gap-2 justify-between items-center">
      <Button
        size="small"
        variant="outline"
        icon={'hugeicons:arrow-left-01'}
        iconPosition="left"
        iconProps={{ width: '16px' }}
        className="text-xs leading-6 mr-2.5"
        disabled={!hasPreviousPage}
        onClick={onPrevious}
      >
        <span className="hidden lg:inline-block">Prev</span>
      </Button>

      <div className="flex-1" />

      <Button
        size="small"
        variant="outline"
        icon={'hugeicons:arrow-right-01'}
        iconPosition="right"
        iconProps={{ width: '16px' }}
        className="text-xs leading-6"
        disabled={!hasNextPage}
        onClick={onNext}
      >
        <span className="hidden lg:inline-block">Next</span>
      </Button>
    </div>
  );
}
