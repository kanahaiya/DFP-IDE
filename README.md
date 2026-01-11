# Data Formatter Pro - Next.js Application

A modern, scalable web application for data formatting tools built with Next.js 15, React, and TypeScript.

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Monaco Editor** - Code editor component (via npm)
- **Zustand** - State management
- **js-yaml** - YAML processing
- **Font Awesome** - Icons
- **Tailwind CSS v4** - Utility-first CSS

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout with fonts
│   │   ├── globals.css           # Global styles & themes
│   │   ├── page.tsx              # Homepage
│   │   └── json-to-openapi/      # Tool pages
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx        # Global header with nav
│   │   │   ├── Footer.tsx        # Global footer
│   │   │   ├── IDELayout.tsx     # Split-pane container
│   │   │   └── ShareWidget.tsx   # Floating share button
│   │   ├── tools/                # Reusable tool components
│   │   │   ├── MonacoEditorPanel.tsx
│   │   │   ├── EditorToolbar.tsx
│   │   │   ├── OutputToolbar.tsx
│   │   │   ├── StatsBar.tsx
│   │   │   ├── MessageBox.tsx
│   │   │   ├── DualPaneTool.tsx
│   │   │   └── openapi/          # Tool-specific components
│   │   │       ├── EndpointManager.tsx
│   │   │       ├── SettingsPanel.tsx
│   │   │       └── OutputFormatToggle.tsx
│   │   └── seo/                  # SEO components
│   │       ├── JsonLd.tsx
│   │       └── SEOContent.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useTheme.ts
│   │   ├── useLayout.ts
│   │   ├── useMonaco.ts
│   │   └── useLocalStorage.ts
│   ├── lib/                      # Utility functions
│   │   ├── fileUtils.ts
│   │   ├── urlUtils.ts
│   │   ├── clipboardUtils.ts
│   │   └── openapi/              # OpenAPI-specific logic
│   │       ├── generator.ts
│   │       ├── typeInference.ts
│   │       └── sampleTemplates.ts
│   ├── store/                    # Zustand stores
│   │   └── openapi.ts
│   └── types/                    # TypeScript types
│       └── index.ts
├── public/                       # Static assets
├── next.config.ts                # Next.js configuration
├── package.json
└── tsconfig.json
```

## 🎯 Architecture Principles

### 1. **Component Reusability**
All tools share common components:
- `MonacoEditorPanel` - Editor with theme support
- `EditorToolbar` / `OutputToolbar` - Action buttons
- `StatsBar` - Character/line/word counts
- `MessageBox` - Success/error notifications
- `IDELayout` - Split-pane container
- `DualPaneTool` - Base wrapper for all dual-pane tools

### 2. **Consistent Theming**
- CSS custom properties for light/dark themes
- Auto-synced with Monaco Editor theme
- Persisted in localStorage
- Smooth transitions without flash

### 3. **State Management**
- **Zustand** for complex tool state (e.g., OpenAPI endpoints)
- **React hooks** for local UI state
- **localStorage hooks** for persistence

### 4. **Type Safety**
- Comprehensive TypeScript interfaces in `src/types/index.ts`
- Proper typing for all components and functions
- Type-safe state management

### 5. **Performance**
- Debounced conversions (500ms)
- Lazy-loaded Monaco Editor
- Automatic layout on resize
- Efficient re-renders with React hooks

## 🛠️ Adding a New Tool

Follow these steps to add a new tool (e.g., "JSON to XML"):

### Step 1: Create Tool Logic

Create conversion functions in `src/lib/`:

```typescript
// src/lib/json-to-xml.ts
export function convertJSONToXML(json: string): string {
  const data = JSON.parse(json);
  // Your conversion logic here
  return xmlString;
}
```

### Step 2: Create Tool Page

Create a new page at `src/app/[tool-name]/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MonacoEditorPanel } from '@/components/tools/MonacoEditorPanel';
import { EditorToolbar } from '@/components/tools/EditorToolbar';
import { OutputToolbar } from '@/components/tools/OutputToolbar';
import { DualPaneTool } from '@/components/tools/DualPaneTool';
import { convertJSONToXML } from '@/lib/json-to-xml';

export default function JSONToXMLPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    try {
      const result = convertJSONToXML(input);
      setOutput(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <DualPaneTool
        leftPanel={
          <div>
            <EditorToolbar label="JSON Input" />
            <MonacoEditorPanel
              value={input}
              onChange={(value) => {
                setInput(value);
                handleConvert();
              }}
              language="json"
            />
          </div>
        }
        rightPanel={
          <div>
            <OutputToolbar label="XML Output" />
            <MonacoEditorPanel
              value={output}
              language="xml"
              readOnly
            />
          </div>
        }
      />
      <Footer />
    </>
  );
}
```

### Step 3: Add to Navigation

Update `src/components/layout/Header.tsx` to include your tool in the dropdown menu.

### Step 4: Add Metadata (Optional but Recommended)

```typescript
// At the top of your page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON to XML Converter - Free Online Tool',
  description: 'Convert JSON to XML format instantly...',
};
```

## 🎨 Theming

The application supports light and dark themes:

- Theme preference stored in localStorage (`dfp_theme`)
- CSS custom properties in `globals.css`
- Monaco Editor theme synced automatically
- Theme toggle in header

### Theme Variables

```css
:root {
  /* Colors */
  --primary: #58A6FF;
  --success: #3FB950;
  --danger: #F85149;
  
  /* Dark Theme */
  --dark-bg: #1E1E1E;
  --dark-card: #252526;
  --dark-text: #D4D4D4;
  
  /* Light Theme */
  --light-bg: #FFFFFF;
  --light-card: #F3F4F6;
  --light-text: #1F2937;
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow existing component patterns
- Use functional components with hooks
- Implement proper error handling
- Add ARIA labels for accessibility

### Component Guidelines

1. **Keep components focused** - Single responsibility
2. **Use TypeScript interfaces** - Define prop types
3. **Handle loading states** - Show appropriate UI
4. **Error boundaries** - Graceful error handling
5. **Accessibility** - ARIA labels, keyboard navigation

### State Management

- **Local UI state** → `useState`
- **Shared state** → Zustand store
- **Persisted state** → `useLocalStorage` hook
- **Tool-specific complex state** → Dedicated Zustand store

## 🔧 Configuration

### Monaco Editor

Monaco webpack configuration is in `next.config.ts`:

```typescript
webpack: (config) => {
  config.module.rules.push({
    test: /\.ttf$/,
    type: 'asset/resource',
  });
  return config;
}
```

### Fonts

Fonts configured in `src/app/layout.tsx`:
- **Inter** for UI
- **Fira Code** for code/monospace

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in `.next/`

## 🤝 Contributing

1. Create feature branch
2. Follow existing patterns
3. Test thoroughly
4. Update documentation
5. Submit pull request

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Monaco Editor for the code editor component
- Font Awesome for icons
