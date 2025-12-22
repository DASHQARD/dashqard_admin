import { useContext } from 'react';

import { SearchContext } from '@/contexts/search-context';
import type { SearchContextType } from '@/types';

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (!context) {
    console.warn('useSearch called outside SearchProvider, returning default values');
    return {
      state: {
        searchQuery: '',
        currentPage: 'Dashboard',
      },
      setSearchQuery: () => {},
      setCurrentPage: () => {},
      clearSearch: () => {},
    };
  }
  return context;
}
