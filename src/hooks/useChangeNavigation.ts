/**
 * Custom hook for change navigation
 */

import { useCallback, useMemo } from 'react';
import { Change } from '@/lib/json-diff/diffEngine';
import { useJSONDiffStore } from '@/store/jsonDiff';

interface UseChangeNavigationResult {
  currentChangeIndex: number;
  filteredChanges: Change[];
  hasNext: boolean;
  hasPrevious: boolean;
  nextChange: () => void;
  prevChange: () => void;
  jumpToChange: (index: number) => void;
  setFilter: (filter: string[]) => void;
}

export function useChangeNavigation(changes: Change[]): UseChangeNavigationResult {
  const { currentChangeIndex, changeFilter, setCurrentChangeIndex, setChangeFilter } = useJSONDiffStore();
  
  // Filter changes based on selected filter
  const filteredChanges = useMemo(() => {
    if (!changeFilter || changeFilter.includes('all') || changeFilter.length === 0) {
      return changes;
    }
    
    return changes.filter(change => {
      return changeFilter.includes(change.type);
    });
  }, [changes, changeFilter]);
  
  const hasNext = useMemo(() => {
    return currentChangeIndex < filteredChanges.length - 1;
  }, [currentChangeIndex, filteredChanges.length]);
  
  const hasPrevious = useMemo(() => {
    return currentChangeIndex > 0;
  }, [currentChangeIndex]);
  
  const nextChange = useCallback(() => {
    if (hasNext) {
      setCurrentChangeIndex(currentChangeIndex + 1);
    }
  }, [hasNext, currentChangeIndex, setCurrentChangeIndex]);
  
  const prevChange = useCallback(() => {
    if (hasPrevious) {
      setCurrentChangeIndex(currentChangeIndex - 1);
    }
  }, [hasPrevious, currentChangeIndex, setCurrentChangeIndex]);
  
  const jumpToChange = useCallback((index: number) => {
    if (index >= 0 && index < filteredChanges.length) {
      setCurrentChangeIndex(index);
    }
  }, [filteredChanges.length, setCurrentChangeIndex]);
  
  const setFilter = useCallback((filter: string[]) => {
    setChangeFilter(filter);
    setCurrentChangeIndex(-1); // Reset to no selection when filter changes
  }, [setChangeFilter, setCurrentChangeIndex]);
  
  return {
    currentChangeIndex,
    filteredChanges,
    hasNext,
    hasPrevious,
    nextChange,
    prevChange,
    jumpToChange,
    setFilter,
  };
}
