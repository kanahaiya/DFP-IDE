/**
 * Longest Common Subsequence (LCS) algorithm for array diffing
 * Uses Wagner-Fischer algorithm (dynamic programming)
 */

export interface LCSMatch {
  type: 'same' | 'added' | 'removed';
  index1?: number;
  index2?: number;
}

export interface IDMatch extends LCSMatch {
  type: 'same' | 'added' | 'removed' | 'modified';
}

type CompareFunction = (a: any, b: any) => boolean;

/**
 * Compute LCS between two arrays
 * @param arr1 - First array
 * @param arr2 - Second array
 * @param compareFn - Comparison function (default: deep equality)
 * @returns Array of LCS matches
 */
export function computeLCS(
  arr1: any[],
  arr2: any[],
  compareFn: CompareFunction | null = null
): LCSMatch[] {
  const m = arr1.length;
  const n = arr2.length;
  
  // Default comparison function
  const compare: CompareFunction = compareFn || ((a, b) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object' && a !== null && b !== null) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
  });
  
  // DP table: dp[i][j] = length of LCS of arr1[0..i-1] and arr2[0..j-1]
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  // Build DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (compare(arr1[i - 1], arr2[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to find the actual LCS and diff
  const diff: LCSMatch[] = [];
  let i = m;
  let j = n;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && compare(arr1[i - 1], arr2[j - 1])) {
      diff.unshift({ type: 'same', index1: i - 1, index2: j - 1 });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'added', index2: j - 1 });
      j--;
    } else {
      diff.unshift({ type: 'removed', index1: i - 1 });
      i--;
    }
  }
  
  return diff;
}

/**
 * Match arrays using identifier-based matching
 * @param arr1 - First array
 * @param arr2 - Second array
 * @param idFields - Array of field names to use as identifiers
 * @returns Array of identifier matches
 */
export function matchByIdentifier(
  arr1: any[],
  arr2: any[],
  idFields: string[] = ['id', 'uuid', 'key', '_id']
): IDMatch[] {
  const result: IDMatch[] = [];
  
  // Build maps for quick lookup
  const map1 = new Map<string, Array<{ item: any; index: number }>>();
  const map2 = new Map<string, Array<{ item: any; index: number }>>();
  
  // Helper to extract identifier from object
  const getId = (item: any, index: number): string => {
    if (typeof item !== 'object' || item === null) {
      return `__index_${index}`;
    }
    
    for (const field of idFields) {
      if (item[field] !== undefined) {
        return String(item[field]);
      }
    }
    
    return `__index_${index}`;
  };
  
  // Build maps
  arr1.forEach((item, index) => {
    const id = getId(item, index);
    if (!map1.has(id)) {
      map1.set(id, []);
    }
    map1.get(id)!.push({ item, index });
  });
  
  arr2.forEach((item, index) => {
    const id = getId(item, index);
    if (!map2.has(id)) {
      map2.set(id, []);
    }
    map2.get(id)!.push({ item, index });
  });
  
  // Find matches
  const matched1 = new Set<number>();
  const matched2 = new Set<number>();
  
  // Match items with same ID
  // CRITICAL: Iterate through arr1 in order to preserve the left array's order
  arr1.forEach((item1, index1) => {
    const id = getId(item1, index1);
    const items2 = map2.get(id);
    
    if (items2 && items2.length > 0) {
      // Find the first unmatched item in arr2 with this ID
      const unmatchedItem2 = items2.find(item => !matched2.has(item.index));
      
      if (unmatchedItem2) {
        result.push({
          type: 'same',
          index1: index1,
          index2: unmatchedItem2.index,
        });
        matched1.add(index1);
        matched2.add(unmatchedItem2.index);
      }
    }
  });
  
  // Add remaining items as added/removed
  arr1.forEach((item, index) => {
    if (!matched1.has(index)) {
      result.push({ type: 'removed', index1: index });
    }
  });
  
  arr2.forEach((item, index) => {
    if (!matched2.has(index)) {
      result.push({ type: 'added', index2: index });
    }
  });
  
  // Sort by original positions
  result.sort((a, b) => {
    const a1 = a.index1 !== undefined ? a.index1 : -1;
    const b1 = b.index1 !== undefined ? b.index1 : -1;
    const a2 = a.index2 !== undefined ? a.index2 : -1;
    const b2 = b.index2 !== undefined ? b.index2 : -1;
    
    if (a1 !== b1) return a1 - b1;
    return a2 - b2;
  });
  
  return result;
}
