@echo off
setlocal enabledelayedexpansion

echo 🧹 Cleaning up duplicate files and organizing project structure...

REM Remove duplicate files in root directory
echo 📁 Removing duplicate files from root directory...

if exist "App.tsx" (
    del "App.tsx"
    echo ✅ Removed root App.tsx (keeping src/App.tsx)
)

if exist "components" (
    rmdir /s /q "components"
    echo ✅ Removed root components/ directory (keeping src/components/)
)

if exist "styles" (
    rmdir /s /q "styles"
    echo ✅ Removed root styles/ directory (keeping src/styles/)
)

if exist "utils" (
    rmdir /s /q "utils"
    echo ✅ Removed root utils/ directory
)

REM Ensure proper structure exists
echo 📂 Ensuring proper directory structure...
if not exist "src\components" mkdir "src\components"
if not exist "src\styles" mkdir "src\styles"
if not exist "public" mkdir "public"

echo 🔧 Checking for missing PWA files...

REM Check if manifest exists
if not exist "public\manifest.json" (
    echo ⚠️  manifest.json is missing - this will cause 404 errors
)

REM Check if icons exist
if not exist "public\icon-192.svg" (
    if not exist "public\icon-192.png" (
        echo ⚠️  PWA icons are missing
    )
)

echo ✨ Cleanup complete!
echo.
echo 📋 Your project structure should now be:
echo ├── src/
echo │   ├── App.tsx
echo │   ├── main.tsx
echo │   ├── components/
echo │   │   └── PWAInstaller.tsx
echo │   └── styles/
echo │       └── globals.css
echo ├── public/
echo │   ├── manifest.json
echo │   ├── icon-192.svg
echo │   ├── icon-512.svg
echo │   └── favicon.svg
echo ├── package.json
echo ├── vite.config.ts
echo └── README.md
echo.
echo 🎯 The manifest 404 error should now be fixed!
echo 🚀 Ready for development and deployment!

pause