#!/bin/bash
# Setup script for git hooks
# Run this script to install pre-commit hooks with automated review and fixes

echo "🔧 Setting up git hooks..."

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Pre-commit hook content
cat > "$PROJECT_ROOT/.git/hooks/pre-commit" << 'HOOK_CONTENT'
#!/bin/sh
# Enhanced pre-commit hook with auto-fix capabilities
# This hook runs automated checks and applies fixes before commit

echo "🔍 Running automated pre-commit review and fixes..."
echo ""

# Store the exit code
EXIT_CODE=0

# Step 1: Run ESLint with auto-fix
echo "📝 Step 1/3: Running ESLint with auto-fix..."
npm run lint -- --fix
ESLINT_EXIT=$?

if [ $ESLINT_EXIT -ne 0 ]; then
  echo "❌ ESLint found issues that couldn't be auto-fixed!"
  echo "   Please review and fix manually, then try committing again."
  EXIT_CODE=1
else
  echo "✅ ESLint passed (auto-fixed issues if any)"
fi
echo ""

# Step 2: Run TypeScript type checking
echo "🔷 Step 2/3: Running TypeScript type checking..."
npx tsc --noEmit
TS_EXIT=$?

if [ $TS_EXIT -ne 0 ]; then
  echo "❌ TypeScript found type errors!"
  echo "   Please fix type errors and try committing again."
  EXIT_CODE=1
else
  echo "✅ TypeScript type checking passed"
fi
echo ""

# Step 3: Stage auto-fixed files
if [ $EXIT_CODE -eq 0 ]; then
  echo "📦 Step 3/3: Staging auto-fixed files..."
  
  # Get list of modified files that were auto-fixed
  FIXED_FILES=$(git diff --name-only --diff-filter=M)
  
  if [ -n "$FIXED_FILES" ]; then
    echo "   Auto-fixed files:"
    echo "$FIXED_FILES" | sed 's/^/   - /'
    git add $FIXED_FILES
    echo "✅ Auto-fixed files staged for commit"
  else
    echo "✅ No files needed auto-fixing"
  fi
fi
echo ""

# Final result
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All automated checks passed! Proceeding with commit..."
  echo ""
else
  echo "❌ Automated review failed! Please fix the issues above and try again."
  echo ""
  echo "💡 Tips:"
  echo "   - Run 'npm run lint -- --fix' to auto-fix ESLint issues"
  echo "   - Run 'npx tsc --noEmit' to see TypeScript errors"
  echo "   - Use Cursor's Agent Review (Cmd+Shift+R) for AI-powered suggestions"
  echo ""
fi

exit $EXIT_CODE
HOOK_CONTENT

# Make the hook executable
chmod +x "$PROJECT_ROOT/.git/hooks/pre-commit"

echo "✅ Git hooks installed successfully!"
echo ""
echo "📋 Installed hooks:"
echo "   - pre-commit: Runs ESLint (with auto-fix) and TypeScript checks"
echo ""
echo "💡 The pre-commit hook will now:"
echo "   1. Auto-fix ESLint issues"
echo "   2. Check TypeScript types"
echo "   3. Stage fixed files automatically"
echo "   4. Block commits if errors remain"
echo ""
echo "🎯 To manually trigger Cursor's Agent Review:"
echo "   - Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)"
echo "   - Or use the 'FFIL' command in Cursor chat"
echo ""
