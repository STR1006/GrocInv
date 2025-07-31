#!/bin/bash

# Cleanup script for Gulu Inventory project structure
echo "🧹 Cleaning up project structure..."

# Remove duplicate files in root directory
echo "📁 Removing duplicate files..."
if [ -f "App.tsx" ]; then
    rm App.tsx
    echo "✅ Removed root App.tsx (keeping src/App.tsx)"
fi

if [ -d "components/" ]; then
    rm -rf components/
    echo "✅ Removed root components/ directory (keeping src/components/)"
fi

if [ -d "styles/" ]; then
    rm -rf styles/
    echo "✅ Removed root styles/ directory (keeping src/styles/)"
fi

if [ -d "utils/" ]; then
    rm -rf utils/
    echo "✅ Removed root utils/ directory"
fi

# Ensure proper structure exists
echo "📂 Ensuring proper directory structure..."
mkdir -p src/components
mkdir -p src/styles
mkdir -p public

# Create proper PWA icons directory if it doesn't exist
mkdir -p public/icons

echo "✨ Cleanup complete! Your project structure is now organized."
echo ""
echo "📋 Current structure should be:"
echo "├── src/"
echo "│   ├── App.tsx"
echo "│   ├── main.tsx"
echo "│   ├── components/"
echo "│   │   └── PWAInstaller.tsx"
echo "│   └── styles/"
echo "│       └── globals.css"
echo "├── public/"
echo "├── package.json"
echo "├── vite.config.ts"
echo "└── README.md"
echo ""
echo "🚀 Ready for Git initialization!"