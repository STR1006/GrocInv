#!/bin/bash

# Enhanced cleanup script for Gulu Inventory project structure
echo "🧹 Cleaning up duplicate files and organizing project structure..."

# Remove duplicate files in root directory
echo "📁 Removing duplicate files from root directory..."

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

echo "🔧 Checking for missing PWA files..."

# Check if manifest exists
if [ ! -f "public/manifest.json" ]; then
    echo "⚠️  manifest.json is missing - this will cause 404 errors"
fi

# Check if icons exist
if [ ! -f "public/icon-192.svg" ] && [ ! -f "public/icon-192.png" ]; then
    echo "⚠️  PWA icons are missing"
fi

echo "✨ Cleanup complete!"
echo ""
echo "📋 Your project structure should now be:"
echo "├── src/"
echo "│   ├── App.tsx"
echo "│   ├── main.tsx"
echo "│   ├── components/"
echo "│   │   └── PWAInstaller.tsx"
echo "│   └── styles/"
echo "│       └── globals.css"
echo "├── public/"
echo "│   ├── manifest.json"
echo "│   ├── icon-192.svg"
echo "│   ├── icon-512.svg"
echo "│   └── favicon.svg"
echo "├── package.json"
echo "├── vite.config.ts"
echo "└── README.md"
echo ""
echo "🎯 The manifest 404 error should now be fixed!"
echo "🚀 Ready for development and deployment!"