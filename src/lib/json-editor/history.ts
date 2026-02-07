/**
 * JSON Editor History Management
 * Undo/Redo functionality with action tracking
 */

import type { JsonValue, HistoryAction, HistoryState } from './types';

/**
 * Generate unique action ID
 */
function generateActionId(): string {
  return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create initial history state
 */
export function createHistoryState(): HistoryState {
  return {
    past: [],
    future: [],
    currentIndex: -1,
  };
}

/**
 * Record an action in history
 */
export function recordAction(
  history: HistoryState,
  type: HistoryAction['type'],
  description: string,
  previousState: JsonValue,
  newState: JsonValue,
  path: string[],
  maxHistorySize: number = 50
): HistoryState {
  const action: HistoryAction = {
    id: generateActionId(),
    timestamp: Date.now(),
    type,
    description,
    previousState,
    newState,
    path,
  };
  
  // Clear future when new action is recorded
  const newPast = [...history.past, action];
  
  // Trim history if it exceeds max size
  const trimmedPast = newPast.length > maxHistorySize 
    ? newPast.slice(newPast.length - maxHistorySize) 
    : newPast;
  
  return {
    past: trimmedPast,
    future: [],
    currentIndex: trimmedPast.length - 1,
  };
}

/**
 * Check if undo is available
 */
export function canUndo(history: HistoryState): boolean {
  return history.past.length > 0;
}

/**
 * Check if redo is available
 */
export function canRedo(history: HistoryState): boolean {
  return history.future.length > 0;
}

/**
 * Perform undo operation
 */
export function undo(
  history: HistoryState
): { history: HistoryState; action: HistoryAction | null } {
  if (!canUndo(history)) {
    return { history, action: null };
  }
  
  const [lastAction, ...remainingPast] = [...history.past].reverse();
  
  return {
    history: {
      past: remainingPast.reverse(),
      future: [lastAction, ...history.future],
      currentIndex: history.currentIndex - 1,
    },
    action: lastAction,
  };
}

/**
 * Perform redo operation
 */
export function redo(
  history: HistoryState
): { history: HistoryState; action: HistoryAction | null } {
  if (!canRedo(history)) {
    return { history, action: null };
  }
  
  const [nextAction, ...remainingFuture] = history.future;
  
  return {
    history: {
      past: [...history.past, nextAction],
      future: remainingFuture,
      currentIndex: history.currentIndex + 1,
    },
    action: nextAction,
  };
}

/**
 * Clear history
 */
export function clearHistory(): HistoryState {
  return createHistoryState();
}

/**
 * Get action description for display
 */
export function getActionDescription(action: HistoryAction): string {
  const pathStr = action.path.length > 0 
    ? action.path.join(' → ') 
    : 'root';
  
  switch (action.type) {
    case 'setValue':
      return `Changed value at ${pathStr}`;
    case 'setKey':
      return `Renamed key at ${pathStr}`;
    case 'addProperty':
      return `Added property at ${pathStr}`;
    case 'deleteProperty':
      return `Deleted property at ${pathStr}`;
    case 'moveProperty':
      return `Moved property at ${pathStr}`;
    case 'paste':
      return `Pasted at ${pathStr}`;
    case 'import':
      return `Imported data`;
    default:
      return action.description;
  }
}

/**
 * Get undo stack summary
 */
export function getUndoStackSummary(history: HistoryState, maxItems: number = 10): {
  description: string;
  timestamp: number;
}[] {
  return history.past
    .slice(-maxItems)
    .reverse()
    .map((action) => ({
      description: getActionDescription(action),
      timestamp: action.timestamp,
    }));
}

/**
 * Get redo stack summary
 */
export function getRedoStackSummary(history: HistoryState, maxItems: number = 10): {
  description: string;
  timestamp: number;
}[] {
  return history.future
    .slice(0, maxItems)
    .map((action) => ({
      description: getActionDescription(action),
      timestamp: action.timestamp,
    }));
}

/**
 * Estimate memory usage of history (approximate)
 */
export function estimateHistoryMemory(history: HistoryState): number {
  const stringify = JSON.stringify;
  let size = 0;
  
  for (const action of history.past) {
    size += stringify(action.previousState).length;
    size += stringify(action.newState).length;
  }
  
  for (const action of history.future) {
    size += stringify(action.previousState).length;
    size += stringify(action.newState).length;
  }
  
  return size;
}

/**
 * Format memory size for display
 */
export function formatMemorySize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check if history should be trimmed based on memory limit
 */
export function shouldTrimHistory(
  history: HistoryState,
  memoryLimitBytes: number = 5 * 1024 * 1024 // 5MB default
): boolean {
  return estimateHistoryMemory(history) > memoryLimitBytes;
}

/**
 * Trim history to fit within memory limit
 */
export function trimHistoryByMemory(
  history: HistoryState,
  memoryLimitBytes: number = 5 * 1024 * 1024
): HistoryState {
  if (!shouldTrimHistory(history, memoryLimitBytes)) {
    return history;
  }
  
  const newPast = [...history.past];
  
  while (
    newPast.length > 1 && 
    estimateHistoryMemory({ ...history, past: newPast }) > memoryLimitBytes
  ) {
    newPast.shift();
  }
  
  return {
    ...history,
    past: newPast,
    currentIndex: newPast.length - 1,
  };
}
