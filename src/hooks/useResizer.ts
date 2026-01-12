'use client';

import { useEffect, useRef, useState } from 'react';

interface UseResizerProps {
  defaultSize?: number; // Default size as percentage (0-100)
  minSize?: number; // Minimum size as percentage
  maxSize?: number; // Maximum size as percentage
  direction?: 'horizontal' | 'vertical';
}

export function useResizer({
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  direction = 'horizontal',
}: UseResizerProps = {}) {
  // Initialize size with defaultSize, will reset when direction changes
  const [size, setSize] = useState(defaultSize);
  const isResizing = useRef(false);
  const resizerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevDirectionRef = useRef(direction);
  const prevDefaultSizeRef = useRef(defaultSize);

  // Reset size when direction or defaultSize changes
  useEffect(() => {
    if (prevDirectionRef.current !== direction || prevDefaultSizeRef.current !== defaultSize) {
      prevDirectionRef.current = direction;
      prevDefaultSizeRef.current = defaultSize;
    setSize(defaultSize);
      
    // Trigger resize event for Monaco Editor after CSS transition completes
      const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      }, 350);
      
      return () => clearTimeout(timer);
    }
  }, [direction, defaultSize]);

  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    const handleMouseDown = (e: MouseEvent) => {
      isResizing.current = true;
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
      resizer.classList.add('dragging');
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      let newSize: number;
      if (direction === 'horizontal') {
        const offsetX = e.clientX - containerRect.left;
        newSize = (offsetX / containerRect.width) * 100;
      } else {
        const offsetY = e.clientY - containerRect.top;
        newSize = (offsetY / containerRect.height) * 100;
      }

      // Clamp the size within min and max bounds
      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
      
      // Trigger resize event for Monaco Editor
      window.dispatchEvent(new Event('resize'));
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        if (resizer) {
          resizer.classList.remove('dragging');
        }
      }
    };

    resizer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      resizer.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [direction, minSize, maxSize]);

  return {
    size,
    setSize,
    resizerRef,
    containerRef,
  };
}
