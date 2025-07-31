@echo off
setlocal enabledelayedexpansion

echo 🚀 Setting up Gulu Inventory for GitHub...

REM Check if git is installed
git --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo    Download from: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo 🧹 Cleaning up project structure...
if exist "App.tsx" del "App.tsx"
if exist "components" rmdir /s /q "components"
if exist "styles" rmdir /s /q "styles"
if exist "utils" rmdir /s /q "utils"

REM Initialize git if not already initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
)

REM Create .gitignore if it doesn't exist
if not exist ".gitignore" (
    echo 📝 Creating .gitignore...
    (
        echo # Dependencies
        echo node_modules/
        echo .pnpm-debug.log*
        echo.
        echo # Production builds
        echo dist/
        echo dist-ssr/
        echo *.local
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.development.local
        echo .env.test.local
        echo .env.production.local
        echo.
        echo # Editor directories and files
        echo .vscode/*
        echo !.vscode/extensions.json
        echo .idea/
        echo .DS_Store
        echo *.suo
        echo *.ntvs*
        echo *.njsproj*
        echo *.sln
        echo *.sw?
        echo.
        echo # PWA
        echo dev-dist/
        echo sw.js
        echo sw.js.map
        echo workbox-*.js
        echo workbox-*.js.map
        echo.
        echo # Logs
        echo logs/
        echo *.log
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo pnpm-debug.log*
        echo lerna-debug.log*
    ) > .gitignore
    echo ✅ .gitignore created
)

REM Stage all files
echo 📁 Staging files for commit...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if !errorlevel! neq 0 (
    echo 💾 Creating initial commit...
    git commit -m "Initial commit: Gulu Inventory PWA with category support"
    echo ✅ Initial commit created
) else (
    echo ℹ️  No changes to commit
)

REM Set default branch to main
git branch -M main

echo.
echo 🎉 Git repository is ready!
echo.
echo 📋 Next steps:
echo 1. Create a repository on GitHub:
echo    - Go to https://github.com/new
echo    - Repository name: gulu-inventory
echo    - Description: A grocery list PWA for inventory management
echo    - Make it public or private
echo    - DON'T add README, .gitignore, or license (we have them)
echo.
echo 2. Connect to GitHub (replace YOUR_USERNAME):
echo    git remote add origin https://github.com/YOUR_USERNAME/gulu-inventory.git
echo    git push -u origin main
echo.
echo 🔧 Alternative: Use VS Code:
echo    1. Open Command Palette (Ctrl+Shift+P)
echo    2. Type 'Git: Add Remote'
echo    3. Add your GitHub repository URL
echo    4. Use Source Control panel to push
echo.
echo ✨ Setup complete! Happy coding! 🚀

pause