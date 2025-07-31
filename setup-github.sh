#!/bin/bash

# GitHub setup script for Gulu Inventory
set -e

echo "🚀 Setting up Gulu Inventory for GitHub..."

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if git is installed
if ! command_exists git; then
    echo "❌ Git is not installed. Please install Git first."
    echo "   Download from: https://git-scm.com/downloads"
    exit 1
fi

# Clean up project structure first
echo "🧹 Cleaning up project structure..."
if [ -f "App.tsx" ]; then rm App.tsx; fi
if [ -d "components/" ]; then rm -rf components/; fi
if [ -d "styles/" ]; then rm -rf styles/; fi
if [ -d "utils/" ]; then rm -rf utils/; fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
.pnpm-debug.log*

# Production builds
dist/
dist-ssr/
*.local

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea/
.DS_Store
*.suo
*.ntvs*
*.njsproj*
*.sln
*.sw?

# PWA
dev-dist/
sw.js
sw.js.map
workbox-*.js
workbox-*.js.map

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
EOL
    echo "✅ .gitignore created"
fi

# Stage all files
echo "📁 Staging files for commit..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: Gulu Inventory PWA with category support

Features:
- Progressive Web App (PWA) with offline support
- Product categorization and filtering
- CSV import functionality
- Share codes for list sharing
- Responsive design with Tailwind CSS
- TypeScript support"
    echo "✅ Initial commit created"
fi

# Set default branch to main
git branch -M main

echo ""
echo "🎉 Git repository is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Create a repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: gulu-inventory"
echo "   - Description: A grocery list PWA for inventory management"
echo "   - Make it public or private"
echo "   - DON'T add README, .gitignore, or license (we have them)"
echo ""
echo "2. Connect to GitHub (replace YOUR_USERNAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/gulu-inventory.git"
echo "   git push -u origin main"
echo ""
echo "🔧 Alternative: Use GitHub CLI (if installed):"
echo "   gh repo create gulu-inventory --public --description 'A grocery list PWA for inventory management'"
echo "   git remote add origin https://github.com/\$(gh api user --jq .login)/gulu-inventory.git"
echo "   git push -u origin main"
echo ""
echo "📦 Alternative: Use VS Code:"
echo "   1. Open Command Palette (Ctrl+Shift+P)"
echo "   2. Type 'Git: Add Remote'"
echo "   3. Add your GitHub repository URL"
echo "   4. Use Source Control panel to push"

# Check if GitHub CLI is available
if command_exists gh; then
    echo ""
    read -p "🤖 Do you want to create the GitHub repository now using GitHub CLI? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔐 Logging in to GitHub..."
        if gh auth status >/dev/null 2>&1; then
            echo "✅ Already logged in to GitHub"
        else
            gh auth login
        fi
        
        echo "📦 Creating GitHub repository..."
        gh repo create gulu-inventory --public --description "A grocery list PWA for inventory management" --confirm
        
        echo "🔗 Adding remote origin..."
        GITHUB_USER=$(gh api user --jq .login)
        git remote add origin "https://github.com/${GITHUB_USER}/gulu-inventory.git" 2>/dev/null || true
        
        echo "📤 Pushing to GitHub..."
        git push -u origin main
        
        echo ""
        echo "🎉 Successfully uploaded to GitHub!"
        echo "🌐 Repository: https://github.com/${GITHUB_USER}/gulu-inventory"
        
        read -p "🌍 Do you want to enable GitHub Pages for live demo? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            gh api repos/${GITHUB_USER}/gulu-inventory/pages -X POST -f source[branch]=main -f source[path]=/ || echo "ℹ️  Pages setup may need manual configuration"
            echo "🌐 Live demo will be available at: https://${GITHUB_USER}.github.io/gulu-inventory"
        fi
    fi
fi

echo ""
echo "✨ Setup complete! Happy coding! 🚀"