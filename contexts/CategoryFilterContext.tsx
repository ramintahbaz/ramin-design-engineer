'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type CategoryFilterValue = 'all' | 'product' | 'film' | 'interaction' | 'writing';

export const CATEGORY_FILTER_OPTIONS: { value: CategoryFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'product', label: 'Product' },
  { value: 'film', label: 'Film' },
  { value: 'interaction', label: 'Interaction' },
  { value: 'writing', label: 'Writing' },
];

type ContextValue = {
  categoryFilter: CategoryFilterValue;
  setCategoryFilter: (v: CategoryFilterValue) => void;
};

const CategoryFilterContext = createContext<ContextValue | null>(null);

export function CategoryFilterProvider({ children }: { children: ReactNode }) {
  // Always start at 'all' on load so refresh resets filters (no restore from URL).
  const [categoryFilter, setCategoryFilterState] = useState<CategoryFilterValue>('all');
  const setCategoryFilter = useCallback((value: CategoryFilterValue) => {
    setCategoryFilterState(value);
    const params = new URLSearchParams(window.location.search);
    params.set('filter', value);
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, []);
  return (
    <CategoryFilterContext.Provider value={{ categoryFilter, setCategoryFilter }}>
      {children}
    </CategoryFilterContext.Provider>
  );
}

export function useCategoryFilter(): ContextValue {
  const ctx = useContext(CategoryFilterContext);
  if (!ctx) throw new Error('useCategoryFilter must be used within CategoryFilterProvider');
  return ctx;
}

export function useCategoryFilterOptional(): ContextValue | null {
  return useContext(CategoryFilterContext);
}
