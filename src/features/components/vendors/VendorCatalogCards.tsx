import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CustomIcon, Text } from '@/components';
import { LogoPlaceholder } from '@/assets/images';
import type { VendorCatalogCard } from '@/types';

type VendorCatalogCardsProps = {
  cards: VendorCatalogCard[];
  title?: string;
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency || 'GHS',
  }).format(amount);
}

function cardImageUrl(card: VendorCatalogCard) {
  return card.images?.[0]?.file_url?.trim() || '';
}

function cardBadgeLabel(card: VendorCatalogCard) {
  if (card.type) return card.type;
  if (card.status === 'active') return 'Active';
  return card.status;
}

export function VendorCatalogCards({
  cards,
  title = 'Gift Cards',
}: VendorCatalogCardsProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [cards.length, showAll, updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 196;
    const gap = 16;
    const amount = (cardWidth + gap) * 2;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (cards.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <Text className="text-sm text-gray-500 text-center">
          No cards found in catalog.
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <Text variant="h6" weight="semibold" className="text-primary-900">
          {title}
        </Text>
        {!showAll && cards.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll cards left"
              disabled={!canScrollLeft}
              onClick={() => scroll('left')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white transition-opacity disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Scroll cards right"
              disabled={!canScrollRight}
              onClick={() => scroll('right')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white transition-opacity disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {showAll ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cards.map((card) => (
            <CatalogCard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card) => (
            <div key={card.id} className="snap-start shrink-0">
              <CatalogCard card={card} />
            </div>
          ))}
        </div>
      )}

      {cards.length > 5 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {showAll ? 'Show carousel' : `View all ${cards.length} cards`}
            <CustomIcon
              name="ArrowRight"
              width={16}
              height={16}
              className={showAll ? 'rotate-180' : ''}
            />
          </button>
        </div>
      )}
    </div>
  );
}

function CatalogCard({ card }: { card: VendorCatalogCard }) {
  const imageUrl = cardImageUrl(card);
  const badge = cardBadgeLabel(card);

  return (
    <article className="flex w-[184px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)]">
      <div className="relative h-[108px] w-full overflow-hidden bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={card.product}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
            <img
              src={LogoPlaceholder}
              alt=""
              className="max-h-12 max-w-[80%] object-contain opacity-60"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="min-h-[40px]">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-primary-900">
            {card.product}
          </p>
          <p className="mt-1 text-xs font-semibold text-primary-600">
            {formatAmount(card.amount, card.currency)}
          </p>
        </div>

        {badge && (
          <span className="mt-auto inline-flex w-fit rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-medium text-violet-700">
            {badge}
          </span>
        )}
      </div>
    </article>
  );
}
