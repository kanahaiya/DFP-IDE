/**
 * Performance monitoring utilities
 * Tracks performance metrics to ensure targets are met
 */

// Performance Targets
const PERFORMANCE_TARGETS = {
  diffComputation: {
    '<1MB': 100,      // <100ms for small files
    '1-10MB': 2000,   // <2 seconds for medium files
    '>10MB': 10000,   // <10 seconds for large files
  },
  fileLoad: {
    '<1MB': 100,
    '1-10MB': 500,
    '>10MB': 2000,
  },
  uiInteraction: 100,  // <100ms for UI interactions
  keyboardLatency: 50,  // <50ms for keystroke to display
};

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

interface PerformanceViolation {
  category: string;
  name: string;
  duration: number;
  target: number;
  timestamp: number;
  categoryLabel?: string;
}

const metrics: Record<string, PerformanceMetric[]> = {
  diffComputation: [],
  fileLoad: [],
  uiInteraction: [],
  keyboardLatency: [],
};

const violations: PerformanceViolation[] = [];

/**
 * Get file size category from measurement name
 */
function getFileSizeCategory(name: string): string | null {
  if (name.includes('<1MB')) return '<1MB';
  if (name.includes('1-10MB')) return '1-10MB';
  if (name.includes('>10MB')) return '>10MB';
  
  const match = name.match(/(\d+\.?\d*)MB/);
  if (match) {
    const sizeMB = parseFloat(match[1]);
    if (sizeMB < 1) return '<1MB';
    if (sizeMB < 10) return '1-10MB';
    return '>10MB';
  }
  
  return null;
}

/**
 * Check if performance target is met
 */
function checkPerformanceTarget(category: string, name: string, duration: number) {
  const target = (PERFORMANCE_TARGETS as any)[category];
  if (!target) return { met: true, target: null };
  
  if (category === 'diffComputation' || category === 'fileLoad') {
    const sizeCategory = getFileSizeCategory(name);
    if (sizeCategory && target[sizeCategory]) {
      const targetValue = target[sizeCategory];
      return {
        met: duration <= targetValue,
        target: targetValue,
        category: sizeCategory,
      };
    }
  } else if (typeof target === 'number') {
    return {
      met: duration <= target,
      target: target,
    };
  }
  
  return { met: true, target: null };
}

/**
 * Start a performance measurement
 * @param category - Category of measurement
 * @param name - Name of the operation
 * @returns Function to call when operation completes
 */
export function startMeasure(category: string, name: string): () => number {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    metrics[category] = metrics[category] || [];
    metrics[category].push({
      name,
      duration,
      timestamp: Date.now(),
    });
    
    // Keep only last 100 measurements per category
    if (metrics[category].length > 100) {
      metrics[category].shift();
    }
    
    // Check performance targets
    const targetCheck = checkPerformanceTarget(category, name, duration);
    if (!targetCheck.met) {
      const violation: PerformanceViolation = {
        category,
        name,
        duration,
        target: targetCheck.target!,
        timestamp: Date.now(),
        categoryLabel: targetCheck.category || category,
      };
      
      violations.push(violation);
      
      // Keep only last 50 violations
      if (violations.length > 50) {
        violations.shift();
      }
      
      // Dispatch event for UI to show alert
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('performanceViolation', { detail: violation }));
      }
    }
    
    return duration;
  };
}

/**
 * Get performance metrics
 * @param category - Optional category filter
 * @returns Performance metrics
 */
export function getMetrics(category: string | null = null): Record<string, PerformanceMetric[]> | PerformanceMetric[] {
  if (category) {
    return metrics[category] || [];
  }
  return metrics;
}

/**
 * Get average performance for a category
 * @param category - Category name
 * @param name - Optional operation name filter
 * @returns Average duration in milliseconds
 */
export function getAveragePerformance(category: string, name: string | null = null): number {
  const categoryMetrics = metrics[category] || [];
  const filtered = name 
    ? categoryMetrics.filter(m => m.name === name)
    : categoryMetrics;
  
  if (filtered.length === 0) return 0;
  
  const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
  return sum / filtered.length;
}

/**
 * Clear all metrics
 */
export function clearMetrics(): void {
  Object.keys(metrics).forEach(key => {
    metrics[key] = [];
  });
  violations.length = 0;
}

/**
 * Get performance violations
 * @returns Array of performance violations
 */
export function getViolations(): PerformanceViolation[] {
  return violations;
}
