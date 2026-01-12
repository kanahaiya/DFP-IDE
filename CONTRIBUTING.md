# Contributing to Data Formatter Pro

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Cursor IDE (recommended for AI-powered code review)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DFP-IDE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup git hooks** (IMPORTANT)
   ```bash
   ./scripts/setup-git-hooks.sh
   ```
   This installs pre-commit hooks that automatically:
   - Run ESLint with auto-fix
   - Check TypeScript types
   - Stage fixed files
   - Block commits with errors

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔍 Code Quality

### Automated Checks

The pre-commit hook runs automatically before each commit:

```bash
🔍 Running automated pre-commit review and fixes...

📝 Step 1/3: Running ESLint with auto-fix...
✅ ESLint passed (auto-fixed issues if any)

🔷 Step 2/3: Running TypeScript type checking...
✅ TypeScript type checking passed

📦 Step 3/3: Staging auto-fixed files...
✅ No files needed auto-fixing

✅ All automated checks passed! Proceeding with commit...
```

### Manual Review (Cursor IDE)

For AI-powered code review before committing:

1. **Agent Review Shortcut**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
2. **FFIL Command**: Type "FFIL" in Cursor chat for automated fix loop
3. **Review Features**:
   - Detects bugs and anti-patterns
   - Suggests performance improvements
   - Identifies security issues
   - Proposes type safety enhancements

### Manual Commands

Run checks manually at any time:

```bash
# ESLint (with auto-fix)
npm run lint -- --fix

# TypeScript type checking
npx tsc --noEmit

# Build (production)
npm run build

# Run tests
npm test
npm run test:e2e
```

## 📝 Coding Standards

### TypeScript

- ✅ Strict mode enabled
- ✅ No `any` types (use `unknown` or proper types)
- ✅ Explicit return types for exported functions
- ✅ Proper null/undefined handling

### React

- ✅ Use functional components with hooks
- ✅ Proper dependency arrays in `useEffect`, `useCallback`, `useMemo`
- ✅ Avoid `setState` in `useEffect` (use derived state or refs)
- ✅ Memoize callbacks and objects for referential equality
- ✅ No hydration mismatches (SSR-safe code)

### Code Organization

- ✅ Components: `/src/components/`
- ✅ Hooks: `/src/hooks/`
- ✅ Utilities: `/src/lib/`
- ✅ Types: `/src/types/`
- ✅ Tests: `__tests__/` next to source files

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMyHook.ts`)
- **Utilities**: camelCase (`myUtil.ts`)
- **Types**: PascalCase (`MyType`, `MyInterface`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)

## 🧪 Testing

### Unit Tests (Jest)

```bash
npm test
npm run test:watch
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
```

### Performance Tests (Lighthouse)

```bash
npm run lighthouse
npm run test:lighthouse
```

## 🎯 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(converter): add JSON to OpenAPI conversion
fix(hooks): resolve race condition in useTabs
docs(readme): update installation instructions
refactor(types): replace any with unknown types
perf(editor): memoize activeTab for stable references
```

### FFIL Command

When committing, you can use the **FFIL** (Fix all issues in loop) command:

1. Stage your changes: `git add .`
2. In Cursor chat, type: **"FFIL"**
3. AI will automatically:
   - Run comprehensive reviews
   - Fix all detected issues
   - Re-run checks
   - Loop until all issues resolved
4. Commit: `git commit -m "your message"`

## 🔧 Troubleshooting

### Pre-commit Hook Fails

If the pre-commit hook blocks your commit:

1. **Review the error messages** - they tell you exactly what's wrong
2. **Run manual fixes**:
   ```bash
   npm run lint -- --fix
   npx tsc --noEmit
   ```
3. **Use Cursor's Agent Review** for AI suggestions
4. **Fix issues** and try committing again

### Bypass Hook (NOT RECOMMENDED)

Only in emergencies:
```bash
git commit --no-verify -m "emergency fix"
```

### Reinstall Hooks

If hooks aren't working:
```bash
./scripts/setup-git-hooks.sh
```

## 📦 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** with proper commits

3. **Ensure all checks pass**
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   npm test
   ```

4. **Push your branch**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create a Pull Request** with:
   - Clear description of changes
   - Screenshots (if UI changes)
   - Link to related issues
   - Test results

## 🎨 Design Principles

- **Privacy-first**: All processing happens client-side
- **Performance**: Optimize for fast load times and interactions
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile-friendly**: Responsive design for all screen sizes
- **SEO-optimized**: Proper meta tags, structured data, sitemap

## 📞 Getting Help

- **GitHub Issues**: Report bugs or request features
- **Cursor AI**: Use built-in AI assistant for code questions
- **Documentation**: Check `/docs` folder

## 🙏 Thank You

Your contributions make this project better for everyone!
