/**
 * Custom hook for diff computation with debouncing and performance monitoring
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { compare, computeStats, Change, DiffStats, CompareOptions } from '@/lib/json-diff/diffEngine';
import { sortChangesByArrayIndex } from '@/lib/json-diff/sortChanges';
import { startMeasure } from '@/lib/json-diff/performanceMonitor';
import { JSONDiffSettings } from '@/store/jsonDiff';

interface UseDiffResult {
  changes: Change[];
  stats: DiffStats | null;
  isComputing: boolean;
  error: string | null;
  recompute: () => void;
}

export function useDiff(
  leftJSON: string,
  rightJSON: string,
  settings: JSONDiffSettings
): UseDiffResult {
  const [changes, setChanges] = useState<Change[]>([]);
  const [stats, setStats] = useState<DiffStats | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const computeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastComputeInputRef = useRef<string>('');
  
  const performCompute = useCallback(() => {
    if (!leftJSON || !rightJSON) {
      setChanges([]);
      setStats(null);
      setError(null);
      return;
    }
    
    // Create hash of inputs to avoid recomputation
    const inputHash = `${leftJSON}::${rightJSON}::${JSON.stringify(settings)}`;
    if (inputHash === lastComputeInputRef.current) {
      return;
    }
    
    lastComputeInputRef.current = inputHash;
    setIsComputing(true);
    setError(null);
    
    // Use setTimeout to avoid blocking UI
    setTimeout(() => {
      try {
        // Parse JSON
        const leftData = JSON.parse(leftJSON);
        const rightData = JSON.parse(rightJSON);
        
        // Start performance measurement
        const endMeasure = startMeasure('diffComputation', 'JSON Diff');
        
        // Build compare options from settings
        const resolvedArrayStrategy: CompareOptions['arrayStrategy'] =
          settings.ignoreArrayOrder && settings.arrayStrategy === 'index'
            ? 'lcs'
            : settings.arrayStrategy;

        const options: CompareOptions = {
          arrayStrategy: resolvedArrayStrategy,
          identifierFields: settings.identifierFields,
          ignoreKeyOrder: settings.ignoreKeyOrder,
          treatNullAsMissing: settings.treatNullAsMissing,
          // Backward compatible: if ignoreCase was previously used, treat it as both.
          keyCaseInsensitive: settings.ignoreCaseKeys ?? settings.ignoreCase,
          valueCaseInsensitive: settings.ignoreCaseValues ?? settings.ignoreCase,
          ignoreWhitespace: settings.ignoreWhitespace,
          ignoreProperties: settings.ignoreProperties,
          typeCoercion: !settings.strictTypeChecking,
          floatTolerance: settings.floatTolerance,
          maxDepth: settings.maxDepth,
          ignorePatterns: settings.ignorePatterns,
          subTreePath: settings.subTreePath || null,
          includePatterns: settings.includePatterns,
          excludePatterns: settings.excludePatterns,
          structureOnly: settings.structureOnly,
        };
        
        // Compute diff
        const diffChanges = compare(leftData, rightData, [], options);
        
        // Sort changes
        const sortedChanges = sortChangesByArrayIndex(diffChanges);
        
        // Compute stats
        const diffStats = computeStats(sortedChanges);
        
        // End performance measurement
        endMeasure();
        
        setChanges(sortedChanges);
        setStats(diffStats);
        setIsComputing(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to compute diff';
        setError(errorMessage);
        setChanges([]);
        setStats(null);
        setIsComputing(false);
      }
    }, 0);
  }, [leftJSON, rightJSON, settings]);
  
  useEffect(() => {
    // Debounce diff computation
    if (computeTimeoutRef.current) {
      clearTimeout(computeTimeoutRef.current);
    }
    
    computeTimeoutRef.current = setTimeout(() => {
      performCompute();
    }, 300);
    
    return () => {
      if (computeTimeoutRef.current) {
        clearTimeout(computeTimeoutRef.current);
      }
    };
  }, [performCompute]);
  
  const recompute = useCallback(() => {
    lastComputeInputRef.current = '';
    performCompute();
  }, [performCompute]);
  
  return {
    changes,
    stats,
    isComputing,
    error,
    recompute,
  };
}
