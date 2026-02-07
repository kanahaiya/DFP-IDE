/**
 * JSON Editor Operations
 * Core CRUD operations for editing JSON data
 */

import type {
  JsonValue,
  JsonObject,
  TreeNode,
  FlattenedTree,
  NodeType,
} from './types';
import {
  generateNodeId,
  getValueAtPath,
  setValueAtPath,
  deleteAtPath,
  addPropertyAtPath,
  renameKeyAtPath,
  moveArrayItem,
  getNodeType,
  pathToString,
} from './pathUtils';

/**
 * Build a flattened tree from JSON data
 */
export function buildTree(data: JsonValue): FlattenedTree {
  const nodes = new Map<string, TreeNode>();
  const rootId = generateNodeId();
  
  function processNode(
    value: JsonValue,
    key: string,
    path: string[],
    parentId: string | null,
    depth: number
  ): string {
    const nodeId = depth === 0 ? rootId : generateNodeId();
    const type = getNodeType(value);
    const childrenIds: string[] = [];
    
    // Process children for objects and arrays
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const childPath = [...path, index.toString()];
          const childId = processNode(item, index.toString(), childPath, nodeId, depth + 1);
          childrenIds.push(childId);
        });
      } else {
        Object.entries(value).forEach(([childKey, childValue]) => {
          const childPath = [...path, childKey];
          const childId = processNode(childValue, childKey, childPath, nodeId, depth + 1);
          childrenIds.push(childId);
        });
      }
    }
    
    const node: TreeNode = {
      id: nodeId,
      key,
      value,
      type,
      path,
      depth,
      parentId,
      childrenIds,
      isExpanded: depth < 2, // Expand first 2 levels by default
      isEditing: false,
      isSelected: false,
    };
    
    nodes.set(nodeId, node);
    return nodeId;
  }
  
  processNode(data, 'root', [], null, 0);
  
  // Calculate visible nodes
  const visibleNodeIds = calculateVisibleNodes(nodes, rootId);
  
  return { nodes, rootId, visibleNodeIds };
}

/**
 * Calculate visible nodes based on expansion state
 */
export function calculateVisibleNodes(
  nodes: Map<string, TreeNode>,
  rootId: string
): string[] {
  const visible: string[] = [];
  
  function traverse(nodeId: string): void {
    const node = nodes.get(nodeId);
    if (!node) return;
    
    visible.push(nodeId);
    
    if (node.isExpanded && node.childrenIds.length > 0) {
      node.childrenIds.forEach(traverse);
    }
  }
  
  traverse(rootId);
  return visible;
}

/**
 * Toggle node expansion
 */
export function toggleNodeExpansion(
  tree: FlattenedTree,
  nodeId: string
): FlattenedTree {
  const node = tree.nodes.get(nodeId);
  if (!node) return tree;
  
  const newNodes = new Map(tree.nodes);
  newNodes.set(nodeId, { ...node, isExpanded: !node.isExpanded });
  
  const visibleNodeIds = calculateVisibleNodes(newNodes, tree.rootId);
  
  return { ...tree, nodes: newNodes, visibleNodeIds };
}

/**
 * Expand all nodes
 */
export function expandAllNodes(tree: FlattenedTree): FlattenedTree {
  const newNodes = new Map<string, TreeNode>();
  
  tree.nodes.forEach((node, id) => {
    newNodes.set(id, { ...node, isExpanded: true });
  });
  
  const visibleNodeIds = calculateVisibleNodes(newNodes, tree.rootId);
  
  return { ...tree, nodes: newNodes, visibleNodeIds };
}

/**
 * Collapse all nodes
 */
export function collapseAllNodes(tree: FlattenedTree): FlattenedTree {
  const newNodes = new Map<string, TreeNode>();
  
  tree.nodes.forEach((node, id) => {
    // Keep root expanded
    newNodes.set(id, { ...node, isExpanded: node.depth === 0 });
  });
  
  const visibleNodeIds = calculateVisibleNodes(newNodes, tree.rootId);
  
  return { ...tree, nodes: newNodes, visibleNodeIds };
}

/**
 * Select a node
 */
export function selectNode(
  tree: FlattenedTree,
  nodeId: string | null
): FlattenedTree {
  const newNodes = new Map<string, TreeNode>();
  
  tree.nodes.forEach((node, id) => {
    newNodes.set(id, { ...node, isSelected: id === nodeId });
  });
  
  return { ...tree, nodes: newNodes };
}

/**
 * Set node editing state
 */
export function setNodeEditing(
  tree: FlattenedTree,
  nodeId: string,
  isEditing: boolean
): FlattenedTree {
  const node = tree.nodes.get(nodeId);
  if (!node) return tree;
  
  const newNodes = new Map(tree.nodes);
  newNodes.set(nodeId, { ...node, isEditing });
  
  return { ...tree, nodes: newNodes };
}

/**
 * Update a node's value
 */
export function updateNodeValue(
  data: JsonValue,
  tree: FlattenedTree,
  nodeId: string,
  newValue: JsonValue
): { data: JsonValue; tree: FlattenedTree } {
  const node = tree.nodes.get(nodeId);
  if (!node) return { data, tree };
  
  // Update the JSON data
  const newData = setValueAtPath(data, node.path, newValue);
  
  // Rebuild the tree to reflect changes
  const newTree = buildTree(newData);
  
  // Preserve expansion states from old tree
  const finalNodes = new Map<string, TreeNode>();
  newTree.nodes.forEach((newNode, id) => {
    // Try to find corresponding old node by path
    let oldExpanded = newNode.depth < 2;
    tree.nodes.forEach((oldNode) => {
      if (pathToString(oldNode.path) === pathToString(newNode.path)) {
        oldExpanded = oldNode.isExpanded;
      }
    });
    finalNodes.set(id, { ...newNode, isExpanded: oldExpanded });
  });
  
  const visibleNodeIds = calculateVisibleNodes(finalNodes, newTree.rootId);
  
  return {
    data: newData,
    tree: { ...newTree, nodes: finalNodes, visibleNodeIds },
  };
}

/**
 * Update a node's key (rename)
 */
export function updateNodeKey(
  data: JsonValue,
  tree: FlattenedTree,
  nodeId: string,
  newKey: string
): { data: JsonValue; tree: FlattenedTree } {
  const node = tree.nodes.get(nodeId);
  if (!node || node.path.length === 0) return { data, tree };
  
  const parentPath = node.path.slice(0, -1);
  const oldKey = node.key;
  
  // Update the JSON data
  const newData = renameKeyAtPath(data, parentPath, oldKey, newKey);
  
  // Rebuild the tree to reflect changes
  const newTree = buildTree(newData);
  
  // Preserve expansion states
  const finalNodes = preserveExpansionStates(tree.nodes, newTree.nodes);
  const visibleNodeIds = calculateVisibleNodes(finalNodes, newTree.rootId);
  
  return {
    data: newData,
    tree: { ...newTree, nodes: finalNodes, visibleNodeIds },
  };
}

/**
 * Add a new property to an object or item to an array
 */
export function addNode(
  data: JsonValue,
  tree: FlattenedTree,
  parentNodeId: string,
  key: string,
  value: JsonValue
): { data: JsonValue; tree: FlattenedTree } {
  const parentNode = tree.nodes.get(parentNodeId);
  if (!parentNode) return { data, tree };
  
  // Update the JSON data
  const newData = addPropertyAtPath(data, parentNode.path, key, value);
  
  // Rebuild the tree
  const newTree = buildTree(newData);
  
  // Preserve expansion states and expand parent
  const finalNodes = preserveExpansionStates(tree.nodes, newTree.nodes);
  
  // Make sure parent is expanded
  newTree.nodes.forEach((node, id) => {
    if (pathToString(node.path) === pathToString(parentNode.path)) {
      finalNodes.set(id, { ...finalNodes.get(id)!, isExpanded: true });
    }
  });
  
  const visibleNodeIds = calculateVisibleNodes(finalNodes, newTree.rootId);
  
  return {
    data: newData,
    tree: { ...newTree, nodes: finalNodes, visibleNodeIds },
  };
}

/**
 * Delete a node
 */
export function deleteNode(
  data: JsonValue,
  tree: FlattenedTree,
  nodeId: string
): { data: JsonValue; tree: FlattenedTree } {
  const node = tree.nodes.get(nodeId);
  if (!node || node.path.length === 0) return { data, tree }; // Can't delete root
  
  // Update the JSON data
  const newData = deleteAtPath(data, node.path);
  
  // Rebuild the tree
  const newTree = buildTree(newData);
  
  // Preserve expansion states
  const finalNodes = preserveExpansionStates(tree.nodes, newTree.nodes);
  const visibleNodeIds = calculateVisibleNodes(finalNodes, newTree.rootId);
  
  return {
    data: newData,
    tree: { ...newTree, nodes: finalNodes, visibleNodeIds },
  };
}

/**
 * Duplicate a node
 */
export function duplicateNode(
  data: JsonValue,
  tree: FlattenedTree,
  nodeId: string
): { data: JsonValue; tree: FlattenedTree } {
  const node = tree.nodes.get(nodeId);
  if (!node || node.path.length === 0) return { data, tree };
  
  const parentPath = node.path.slice(0, -1);
  const parent = getValueAtPath(data, parentPath);
  
  if (Array.isArray(parent)) {
    // For arrays, insert copy after current item
    const index = parseInt(node.key, 10);
    const newArray = [...parent];
    newArray.splice(index + 1, 0, JSON.parse(JSON.stringify(node.value)));
    const newData = setValueAtPath(data, parentPath, newArray);
    const newTree = buildTree(newData);
    const finalNodes = preserveExpansionStates(tree.nodes, newTree.nodes);
    const visibleNodeIds = calculateVisibleNodes(finalNodes, newTree.rootId);
    return { data: newData, tree: { ...newTree, nodes: finalNodes, visibleNodeIds } };
  } else if (typeof parent === 'object' && parent !== null) {
    // For objects, create copy with "_copy" suffix
    let newKey = `${node.key}_copy`;
    let counter = 1;
    while (newKey in (parent as JsonObject)) {
      newKey = `${node.key}_copy_${counter}`;
      counter++;
    }
    const newData = addPropertyAtPath(data, parentPath, newKey, JSON.parse(JSON.stringify(node.value)));
    const newTree = buildTree(newData);
    const finalNodes = preserveExpansionStates(tree.nodes, newTree.nodes);
    const visibleNodeIds = calculateVisibleNodes(finalNodes, newTree.rootId);
    return { data: newData, tree: { ...newTree, nodes: finalNodes, visibleNodeIds } };
  }
  
  return { data, tree };
}

/**
 * Move array item up
 */
export function moveNodeUp(
  data: JsonValue,
  tree: FlattenedTree,
  nodeId: string
): { data: JsonValue; tree: FlattenedTree } {
  const node = tree.nodes.get(nodeId);
  if (!node || node.path.length === 0) return { data, tree };
  
  const parentPath = node.path.slice(0, -1);
  const parent = getValueAtPath(data, parentPath);
  
  if (!Array.isArray(parent)) return { data, tree };
  
  const index = parseInt(node.key, 10);
  if (index === 0) return { data, tree }; // Already at top
  
  const newData = moveArrayItem(data, parentPath, index, index - 1);
  const newTree = buildTree(newData);
  const finalNodes = preserveExpansionStates(tree.nodes, newTree.nodes);
  const visibleNodeIds = calculateVisibleNodes(finalNodes, newTree.rootId);
  
  return { data: newData, tree: { ...newTree, nodes: finalNodes, visibleNodeIds } };
}

/**
 * Move array item down
 */
export function moveNodeDown(
  data: JsonValue,
  tree: FlattenedTree,
  nodeId: string
): { data: JsonValue; tree: FlattenedTree } {
  const node = tree.nodes.get(nodeId);
  if (!node || node.path.length === 0) return { data, tree };
  
  const parentPath = node.path.slice(0, -1);
  const parent = getValueAtPath(data, parentPath);
  
  if (!Array.isArray(parent)) return { data, tree };
  
  const index = parseInt(node.key, 10);
  if (index >= parent.length - 1) return { data, tree }; // Already at bottom
  
  const newData = moveArrayItem(data, parentPath, index, index + 1);
  const newTree = buildTree(newData);
  const finalNodes = preserveExpansionStates(tree.nodes, newTree.nodes);
  const visibleNodeIds = calculateVisibleNodes(finalNodes, newTree.rootId);
  
  return { data: newData, tree: { ...newTree, nodes: finalNodes, visibleNodeIds } };
}

/**
 * Change node type
 */
export function changeNodeType(
  data: JsonValue,
  tree: FlattenedTree,
  nodeId: string,
  newType: NodeType
): { data: JsonValue; tree: FlattenedTree } {
  const node = tree.nodes.get(nodeId);
  if (!node) return { data, tree };
  
  const newValue = convertValue(node.value, newType);
  return updateNodeValue(data, tree, nodeId, newValue);
}

/**
 * Convert a value to a new type
 */
export function convertValue(value: JsonValue, toType: NodeType): JsonValue {
  switch (toType) {
    case 'string':
      if (typeof value === 'string') return value;
      return JSON.stringify(value);
    
    case 'number':
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      }
      if (typeof value === 'boolean') return value ? 1 : 0;
      return 0;
    
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value !== 0;
      if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
      return false;
    
    case 'null':
      return null;
    
    case 'object':
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
        } catch {
          // Ignore parse error
        }
      }
      return {};
    
    case 'array':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          // Ignore parse error
        }
      }
      return [];
  }
}

/**
 * Preserve expansion states from old tree to new tree
 */
function preserveExpansionStates(
  oldNodes: Map<string, TreeNode>,
  newNodes: Map<string, TreeNode>
): Map<string, TreeNode> {
  const result = new Map<string, TreeNode>();
  
  // Create a map of path string -> expansion state from old nodes
  const expansionByPath = new Map<string, boolean>();
  oldNodes.forEach((node) => {
    expansionByPath.set(pathToString(node.path), node.isExpanded);
  });
  
  // Apply expansion states to new nodes
  newNodes.forEach((node, id) => {
    const pathStr = pathToString(node.path);
    const wasExpanded = expansionByPath.get(pathStr);
    result.set(id, {
      ...node,
      isExpanded: wasExpanded !== undefined ? wasExpanded : node.depth < 2,
    });
  });
  
  return result;
}

/**
 * Get node statistics
 */
export function getNodeStats(data: JsonValue): {
  totalNodes: number;
  objectCount: number;
  arrayCount: number;
  stringCount: number;
  numberCount: number;
  booleanCount: number;
  nullCount: number;
  maxDepth: number;
  fileSize: number;
} {
  let totalNodes = 0;
  let objectCount = 0;
  let arrayCount = 0;
  let stringCount = 0;
  let numberCount = 0;
  let booleanCount = 0;
  let nullCount = 0;
  let maxDepth = 0;
  
  function traverse(value: JsonValue, depth: number): void {
    totalNodes++;
    maxDepth = Math.max(maxDepth, depth);
    
    if (value === null) {
      nullCount++;
    } else if (Array.isArray(value)) {
      arrayCount++;
      value.forEach((item) => traverse(item, depth + 1));
    } else if (typeof value === 'object') {
      objectCount++;
      Object.values(value).forEach((v) => traverse(v, depth + 1));
    } else if (typeof value === 'string') {
      stringCount++;
    } else if (typeof value === 'number') {
      numberCount++;
    } else if (typeof value === 'boolean') {
      booleanCount++;
    }
  }
  
  traverse(data, 0);
  
  // Calculate approximate file size in bytes
  const fileSize = JSON.stringify(data).length;
  
  return {
    totalNodes,
    objectCount,
    arrayCount,
    stringCount,
    numberCount,
    booleanCount,
    nullCount,
    maxDepth,
    fileSize,
  };
}
