/**
 * JSON to Flow Help Documentation
 * Help content for the Flow visualization tool
 */

export interface HelpSection {
  id: string;
  title: string;
  content: string;
}

export const jsonToFlowHelp: HelpSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: `The JSON Visualizer converts JSON data into interactive flowchart diagrams.

**Key Features:**
- Visual representation of JSON structure
- Color-coded nodes by data type
- Expand/collapse nested structures
- Search and highlight nodes
- Multiple layout algorithms
- Export to PNG, SVG, JPEG`,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: `**Step 1:** Paste your JSON data into the input editor.

**Step 2:** The diagram updates automatically as you type.

**Step 3:** Use mouse controls to zoom and pan.

**Step 4:** Click nodes to expand/collapse children.

**Step 5:** Export the diagram when ready.`,
  },
  {
    id: 'navigation',
    title: 'Navigation Controls',
    content: `**Mouse Controls:**
- Scroll wheel: Zoom in/out
- Click + drag: Pan the view
- Double-click: Fit view to content
- Click node: Expand/collapse

**Keyboard Controls:**
- \`+\` or \`=\`: Zoom in
- \`-\`: Zoom out
- \`0\`: Reset zoom
- \`F\`: Fit to view`,
  },
  {
    id: 'color-coding',
    title: 'Color Coding',
    content: `Nodes are color-coded by JSON type:

| Type | Color |
|------|-------|
| Object | Blue |
| Array | Purple |
| String | Green |
| Number | Amber |
| Boolean | Red |
| Null | Gray |

The number in parentheses shows child count.`,
  },
  {
    id: 'search',
    title: 'Search Feature',
    content: `Use the search bar to find nodes:

**Search by:**
- Key name: \`email\`
- Value: \`john@example.com\`
- Path: \`users[0].name\`

**Behavior:**
- Matching nodes are highlighted
- Non-matching nodes are dimmed
- Clear search to show all nodes`,
  },
  {
    id: 'layouts',
    title: 'Layout Options',
    content: `**Tree Layout:**
- Top-to-bottom hierarchy
- Best for nested structures
- Default layout

**Horizontal Layout:**
- Left-to-right flow
- Good for shallow structures
- Wider diagrams

**Radial Layout:**
- Circular arrangement
- Good for equal siblings
- Compact view`,
  },
  {
    id: 'export',
    title: 'Export Options',
    content: `**PNG:**
- Raster format
- Good for presentations
- Fixed resolution

**SVG:**
- Vector format
- Scalable without quality loss
- Best for documentation

**JPEG:**
- Compressed raster
- Smaller file size
- Good for sharing`,
  },
];
