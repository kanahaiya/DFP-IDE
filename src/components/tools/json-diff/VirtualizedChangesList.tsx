'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface VirtualizedChangesListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  threshold?: number;
  estimatedItemHeight?: number;
  overscan?: number;
  className?: string;
  getKey?: (item: T, index: number) => string | number;
}

/**
 * Simple virtualization component tailored for change lists.
 * Renders only a subset of items and uses estimated heights to keep scrolling smooth.
 */
export function VirtualizedChangesList<T>({
  items = [],
  renderItem,
  threshold = 250,
  estimatedItemHeight = 140,
  overscan = 10,
  className = '',
  getKey,
}: VirtualizedChangesListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heightCacheRef = useRef<Record<number, number>>({});
  const heightStatsRef = useRef({ sum: 0, count: 0 });
  const [avgHeight, setAvgHeight] = useState(estimatedItemHeight);
  const [dimensions, setDimensions] = useState({ height: 0 });
  const [scrollTop, setScrollTop] = useState(0);

  const shouldVirtualize = items.length > threshold;

  useEffect(() => {
    if (!shouldVirtualize) return;
    const node = containerRef.current;
    if (!node) return;
    const initialHeight = node.clientHeight || node.offsetHeight || estimatedItemHeight * 5;
    setDimensions((prev) => ({
      height: initialHeight || prev.height || estimatedItemHeight * 5,
    }));

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDimensions({
        height: entry.contentRect.height,
      });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldVirtualize, estimatedItemHeight]);

  const effectiveAvgHeight = Math.max(avgHeight || estimatedItemHeight, 60);
  const viewportItemCount = dimensions.height > 0
    ? Math.ceil(dimensions.height / effectiveAvgHeight) + overscan * 2
    : overscan * 4;

  const startIndex = shouldVirtualize
    ? Math.max(0, Math.floor(scrollTop / effectiveAvgHeight) - overscan)
    : 0;
  const endIndex = shouldVirtualize
    ? Math.min(items.length, startIndex + viewportItemCount)
    : items.length;

  const visibleItems = useMemo(() => {
    if (!shouldVirtualize) return items;
    return items.slice(startIndex, endIndex);
  }, [items, shouldVirtualize, startIndex, endIndex]);

  const updateMeasuredHeight = useCallback((index: number, height: number) => {
    if (!height || height <= 0) return;
    const current = heightCacheRef.current[index];
    if (current === height) return;

    heightCacheRef.current[index] = height;
    if (current) {
      heightStatsRef.current.sum += height - current;
    } else {
      heightStatsRef.current.sum += height;
      heightStatsRef.current.count += 1;
    }

    const count = heightStatsRef.current.count;
    if (count > 0) {
      const newAvg = heightStatsRef.current.sum / count;
      setAvgHeight(newAvg);
    }
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const measureRef = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      if (node && shouldVirtualize) {
        const rect = node.getBoundingClientRect();
        updateMeasuredHeight(index, rect.height);
      }
    },
    [shouldVirtualize, updateMeasuredHeight]
  );

  const paddingTop = shouldVirtualize ? Math.max(0, startIndex * effectiveAvgHeight) : 0;
  const paddingBottom = shouldVirtualize
    ? Math.max(0, (items.length - endIndex) * effectiveAvgHeight)
    : 0;

  if (!items || items.length === 0) {
    return (
      <div ref={containerRef} className={`h-full overflow-auto ${className}`}>
        <div className="text-center text-sm opacity-60 py-6">
          No changes to display
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-auto ${className}`}
      onScroll={shouldVirtualize ? handleScroll : undefined}
    >
      {shouldVirtualize ? (
        <div style={{ paddingTop, paddingBottom }}>
          {visibleItems.map((item, localIndex) => {
            const actualIndex = startIndex + localIndex;
            const key = getKey ? getKey(item, actualIndex) : actualIndex;
            return (
              <div key={key} ref={measureRef(actualIndex)} className="pb-3 last:pb-0">
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {items.map((item, index) => {
            const key = getKey ? getKey(item, index) : index;
            return (
              <div key={key} className="pb-3 last:pb-0">
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
