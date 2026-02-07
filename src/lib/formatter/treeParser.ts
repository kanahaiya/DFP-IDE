/**
 * JSON Tree Parser - Parse JSON into tree structure for visualization
 */

import type { TreeNode, TreeViewState, JsonValue } from './types';
import { getNodeType, isPlainObject, isArray } from './types';

// ============================================================================
// Tree Parsing
// ============================================================================

let nodeIdCounter = 0;

/**
 * Generate unique node ID
 */
function generateNodeId(): string {
  return `node_${++nodeIdCounter}`;
}

/**
 * Reset node ID counter
 */
export function resetNodeIdCounter(): void {
  nodeIdCounter = 0;
}

/**
 * Parse JSON value into tree node
 */
export function parseToTreeNode(
  key: string,
  value: JsonValue,
  depth: number = 0,
  path: string = '',
  parent?: TreeNode
): TreeNode {
  const id = generateNodeId();
  const type = getNodeType(value);
  const currentPath = path ? `${path}.${key}` : key;
  
  const node: TreeNode = {
    id,
    key,
    value,
    type,
    depth,
    path: currentPath,
    children: [],
    isExpanded: depth < 2, // Auto-expand first two levels
    parent,
  };
  
  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    node.childCount = keys.length;
    node.children = keys.map(k =>
      parseToTreeNode(k, value[k], depth + 1, currentPath, node)
    );
  } else if (isArray(value)) {
    node.childCount = value.length;
    node.children = value.map((item, index) =>
      parseToTreeNode(String(index), item, depth + 1, currentPath, node)
    );
  }
  
  return node;
}

/**
 * Parse JSON string into tree structure
 */
export function parseJSONToTree(jsonString: string): TreeNode | null {
  try {
    resetNodeIdCounter();
    const parsed = JSON.parse(jsonString);
    return parseToTreeNode('root', parsed);
  } catch {
    return null;
  }
}

// ============================================================================
// Tree Operations
// ============================================================================

/**
 * Find node by ID
 */
export function findNodeById(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  
  return null;
}

/**
 * Find node by path
 */
export function findNodeByPath(root: TreeNode, path: string): TreeNode | null {
  const parts = path.split('.').filter(Boolean);
  let current: TreeNode | null = root;
  
  for (let i = 1; i < parts.length; i++) { // Skip 'root'
    if (!current) return null;
    const part = parts[i];
    current = current.children.find(c => c.key === part) || null;
  }
  
  return current;
}

/**
 * Get all node IDs
 */
export function getAllNodeIds(root: TreeNode): string[] {
  const ids: string[] = [root.id];
  for (const child of root.children) {
    ids.push(...getAllNodeIds(child));
  }
  return ids;
}

/**
 * Toggle node expansion
 */
export function toggleNodeExpansion(
  state: TreeViewState,
  nodeId: string
): TreeViewState {
  const newExpanded = new Set(state.expandedNodes);
  
  if (newExpanded.has(nodeId)) {
    newExpanded.delete(nodeId);
  } else {
    newExpanded.add(nodeId);
  }
  
  return {
    ...state,
    expandedNodes: newExpanded,
  };
}

/**
 * Expand all nodes
 */
export function expandAll(root: TreeNode): Set<string> {
  const expanded = new Set<string>();
  
  function traverse(node: TreeNode): void {
    if (node.children.length > 0) {
      expanded.add(node.id);
      node.children.forEach(traverse);
    }
  }
  
  traverse(root);
  return expanded;
}

/**
 * Collapse all nodes
 */
export function collapseAll(): Set<string> {
  return new Set<string>();
}

/**
 * Expand to specific depth
 */
export function expandToDepth(root: TreeNode, maxDepth: number): Set<string> {
  const expanded = new Set<string>();
  
  function traverse(node: TreeNode): void {
    if (node.depth < maxDepth && node.children.length > 0) {
      expanded.add(node.id);
      node.children.forEach(traverse);
    }
  }
  
  traverse(root);
  return expanded;
}

// ============================================================================
// Search in Tree
// ============================================================================

/**
 * Search for nodes matching a query
 */
export function searchTree(
  root: TreeNode,
  query: string,
  caseSensitive: boolean = false
): string[] {
  const matches: string[] = [];
  const searchQuery = caseSensitive ? query : query.toLowerCase();
  
  function matchValue(value: unknown): boolean {
    if (value === null) return 'null'.includes(searchQuery);
    if (typeof value === 'boolean') return String(value).includes(searchQuery);
    if (typeof value === 'number') return String(value).includes(searchQuery);
    if (typeof value === 'string') {
      const compareValue = caseSensitive ? value : value.toLowerCase();
      return compareValue.includes(searchQuery);
    }
    return false;
  }
  
  function traverse(node: TreeNode): void {
    const keyToCompare = caseSensitive ? node.key : node.key.toLowerCase();
    
    if (keyToCompare.includes(searchQuery)) {
      matches.push(node.id);
    } else if (matchValue(node.value) && node.children.length === 0) {
      matches.push(node.id);
    }
    
    node.children.forEach(traverse);
  }
  
  traverse(root);
  return matches;
}

/**
 * Get parent chain to expand for showing a node
 */
export function getParentChain(node: TreeNode): string[] {
  const chain: string[] = [];
  let current = node.parent;
  
  while (current) {
    chain.push(current.id);
    current = current.parent;
  }
  
  return chain;
}

// ============================================================================
// Path Operations
// ============================================================================

/**
 * Get JSON path in dot notation
 */
export function getJSONPathDot(node: TreeNode): string {
  return node.path.replace(/^root\.?/, '') || '$';
}

/**
 * Get JSON path in bracket notation
 */
export function getJSONPathBracket(node: TreeNode): string {
  const parts = node.path.split('.');
  return parts
    .slice(1) // Remove 'root'
    .map(part => {
      if (/^\d+$/.test(part)) {
        return `[${part}]`;
      }
      return `["${part}"]`;
    })
    .join('') || '$';
}

/**
 * Get value at path
 */
export function getValueAtPath(root: TreeNode, path: string): JsonValue | undefined {
  const node = findNodeByPath(root, path);
  return node?.value as JsonValue | undefined;
}

// ============================================================================
// Tree to JSON
// ============================================================================

/**
 * Convert tree node back to JSON value
 */
export function treeNodeToValue(node: TreeNode): JsonValue {
  if (node.type === 'object') {
    const obj: Record<string, JsonValue> = {};
    for (const child of node.children) {
      obj[child.key] = treeNodeToValue(child);
    }
    return obj;
  }
  
  if (node.type === 'array') {
    return node.children.map(child => treeNodeToValue(child));
  }
  
  return node.value as JsonValue;
}

/**
 * Convert tree to formatted JSON string
 */
export function treeToJSONString(root: TreeNode, indent: number = 2): string {
  const value = treeNodeToValue(root);
  return JSON.stringify(value, null, indent);
}

// ============================================================================
// Tree Statistics
// ============================================================================

/**
 * Calculate tree statistics
 */
export interface TreeStats {
  totalNodes: number;
  maxDepth: number;
  objectCount: number;
  arrayCount: number;
  stringCount: number;
  numberCount: number;
  booleanCount: number;
  nullCount: number;
}

/**
 * Get statistics about the tree
 */
export function getTreeStats(root: TreeNode): TreeStats {
  const stats: TreeStats = {
    totalNodes: 0,
    maxDepth: 0,
    objectCount: 0,
    arrayCount: 0,
    stringCount: 0,
    numberCount: 0,
    booleanCount: 0,
    nullCount: 0,
  };
  
  function traverse(node: TreeNode): void {
    stats.totalNodes++;
    stats.maxDepth = Math.max(stats.maxDepth, node.depth);
    
    switch (node.type) {
      case 'object': stats.objectCount++; break;
      case 'array': stats.arrayCount++; break;
      case 'string': stats.stringCount++; break;
      case 'number': stats.numberCount++; break;
      case 'boolean': stats.booleanCount++; break;
      case 'null': stats.nullCount++; break;
    }
    
    node.children.forEach(traverse);
  }
  
  traverse(root);
  return stats;
}
