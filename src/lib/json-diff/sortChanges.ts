/**
 * Sort changes so array elements stay in index order
 */

import { Change } from './diffEngine';
import { parseJSONPath, PathSegment } from './jsonPath';

/**
 * Sort changes by array index
 * @param changes - Array of change objects
 * @returns Sorted array of changes
 */
export function sortChangesByArrayIndex(changes: Change[]): Change[] {
  if (!changes || changes.length === 0) return changes;

  return [...changes].sort((a, b) => {
    let pathA = a.path;
    let pathB = b.path;

    if (!pathA || pathA.length === 0) {
      pathA = parseJSONPath(a.jsonPath || '');
    }
    if (!pathB || pathB.length === 0) {
      pathB = parseJSONPath(b.jsonPath || '');
    }

    if (a.oldIndex !== undefined && pathA.length > 0 && typeof pathA[pathA.length - 1] === 'number') {
      const lastIndex = pathA.length - 1;
      if (pathA[lastIndex] !== a.oldIndex) {
        pathA = [...pathA];
        pathA[lastIndex] = a.oldIndex;
      }
    }
    if (b.oldIndex !== undefined && pathB.length > 0 && typeof pathB[pathB.length - 1] === 'number') {
      const lastIndex = pathB.length - 1;
      if (pathB[lastIndex] !== b.oldIndex) {
        pathB = [...pathB];
        pathB[lastIndex] = b.oldIndex;
      }
    }

    const minLength = Math.min(pathA.length, pathB.length);

    for (let i = 0; i < minLength; i++) {
      const segA = pathA[i];
      const segB = pathB[i];

      if (typeof segA !== typeof segB) {
        return String(segA).localeCompare(String(segB));
      }

      if (typeof segA === 'number' && typeof segB === 'number') {
        if (segA !== segB) {
          return segA - segB;
        }
      } else if (segA !== segB) {
        return String(segA).localeCompare(String(segB));
      }
    }

    if (pathA.length !== pathB.length) {
      return pathA.length - pathB.length;
    }

    return 0;
  });
}
