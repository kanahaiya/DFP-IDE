/**
 * JSON Visualizer - Help Documentation
 */

export interface HelpSection {
  id: string;
  title: string;
  content: string;
}

export const JSON_VISUALIZER_HELP: {
  toolName: string;
  sections: HelpSection[];
} = {
  toolName: 'JSON Visualizer',
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: `
        <p>The JSON Visualizer transforms your JSON data into interactive graphical representations. 
        Choose between 2D diagrams and immersive 3D visualizations to explore complex data structures.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li><strong>2D Mode:</strong> Clear hierarchical diagrams using ReactFlow</li>
          <li><strong>3D Mode:</strong> Interactive Three.js visualizations with orbit controls</li>
          <li><strong>4 Layout Algorithms:</strong> Tree, Force-directed, Radial, Treemap</li>
          <li><strong>Search:</strong> Find specific keys or values</li>
          <li><strong>Export:</strong> PNG, SVG, shareable URLs</li>
        </ul>
      `,
    },
    {
      id: 'input',
      title: 'Input Methods',
      content: `
        <h4>Paste JSON</h4>
        <p>Type or paste JSON directly into the input editor. The editor provides syntax highlighting 
        and will show errors if your JSON is invalid.</p>
        
        <h4>Upload File</h4>
        <p>Click the upload button to select a .json or .txt file from your computer.</p>
        
        <h4>Load from URL</h4>
        <p>Click the link button and enter a URL to fetch JSON from an API or web resource. 
        Note: The URL must support CORS.</p>
      `,
    },
    {
      id: 'visualization-modes',
      title: 'Visualization Modes',
      content: `
        <h4>2D Mode</h4>
        <p>The 2D mode renders your JSON as a flat diagram using ReactFlow. Features include:</p>
        <ul>
          <li>Drag nodes to reposition</li>
          <li>Scroll to zoom</li>
          <li>Click background to pan</li>
          <li>Mini-map for navigation</li>
          <li>All layout algorithms available</li>
        </ul>
        
        <h4>3D Mode</h4>
        <p>The 3D mode creates an immersive visualization using Three.js. Features include:</p>
        <ul>
          <li><strong>Left click + drag:</strong> Rotate view</li>
          <li><strong>Right click + drag:</strong> Pan view</li>
          <li><strong>Scroll:</strong> Zoom in/out</li>
          <li><strong>Auto-rotate:</strong> Enable in settings</li>
          <li>Nodes shaped by data type</li>
        </ul>
      `,
    },
    {
      id: 'layouts',
      title: 'Layout Algorithms',
      content: `
        <h4>Tree Layout</h4>
        <p>Shows hierarchical parent-child relationships in a traditional tree structure. 
        Choose between horizontal (left to right) or vertical (top to bottom) orientation.</p>
        
        <h4>Force-Directed Layout</h4>
        <p>Uses physics simulation to position nodes. Related nodes cluster together while 
        unrelated nodes repel each other. Great for seeing natural groupings in your data.</p>
        
        <h4>Radial Layout</h4>
        <p>Arranges nodes in concentric circles around the root node. The depth in the JSON 
        corresponds to the ring distance from center. Useful for seeing overall structure size.</p>
        
        <h4>Treemap Layout (2D only)</h4>
        <p>Uses nested rectangles where size represents complexity (number of children). 
        Efficiently uses space to show relative importance of different parts of your JSON.</p>
      `,
    },
    {
      id: 'navigation',
      title: 'Navigation & Interaction',
      content: `
        <h4>Expanding/Collapsing Nodes</h4>
        <p>Click the arrow icon on any object or array node to expand or collapse its children. 
        Use the toolbar buttons to expand all, collapse all, or expand to a specific depth.</p>
        
        <h4>Selecting Nodes</h4>
        <p>Click any node to select it and view its details in the Details panel. The path 
        from root to the selected node will be highlighted.</p>
        
        <h4>Keyboard Navigation</h4>
        <ul>
          <li><strong>Enter:</strong> Next search result</li>
          <li><strong>Shift+Enter:</strong> Previous search result</li>
          <li><strong>Escape:</strong> Clear search</li>
        </ul>
      `,
    },
    {
      id: 'search',
      title: 'Search & Filter',
      content: `
        <h4>Search Feature</h4>
        <p>Use the search bar to find specific keys or values in your JSON. Options include:</p>
        <ul>
          <li><strong>Keys:</strong> Search in property names</li>
          <li><strong>Values:</strong> Search in string values</li>
          <li><strong>Match Case:</strong> Case-sensitive search</li>
        </ul>
        
        <h4>Search Results</h4>
        <p>Results are listed below the search bar. Click any result to navigate to that node 
        in the visualization. Use the up/down buttons or Enter key to cycle through results.</p>
      `,
    },
    {
      id: 'export',
      title: 'Export Options',
      content: `
        <h4>PNG Export</h4>
        <p>Exports the current visualization as a PNG image at 2x resolution. Works in both 
        2D and 3D modes.</p>
        
        <h4>SVG Export (2D only)</h4>
        <p>Exports the 2D visualization as a scalable vector graphic. Ideal for documentation 
        or when you need to resize without losing quality.</p>
        
        <h4>JSON Export</h4>
        <p>Downloads your input JSON as a file.</p>
        
        <h4>Shareable URL</h4>
        <p>Generates a URL containing your encoded JSON data. Share this link with others 
        to let them see the same visualization. Note: Very large JSON may exceed URL length limits.</p>
      `,
    },
    {
      id: 'tips',
      title: 'Tips & Best Practices',
      content: `
        <h4>Performance Tips</h4>
        <ul>
          <li>For large JSON (>1000 nodes), start with collapsed view</li>
          <li>Use depth limiter to control visible complexity</li>
          <li>Force layout may be slow for very large datasets</li>
          <li>3D mode requires a modern graphics-capable browser</li>
        </ul>
        
        <h4>Layout Recommendations</h4>
        <ul>
          <li><strong>Configuration files:</strong> Tree layout, vertical orientation</li>
          <li><strong>API responses:</strong> Tree layout, horizontal orientation</li>
          <li><strong>Large datasets:</strong> Radial or Treemap for overview</li>
          <li><strong>Finding relationships:</strong> Force-directed layout</li>
        </ul>
      `,
    },
  ],
};
