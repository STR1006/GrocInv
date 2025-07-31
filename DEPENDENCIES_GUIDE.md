# Gulu Inventory - Dependencies Guide

## 📦 Required NPM Packages

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.263.1"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.15",
  "@types/react-dom": "^18.2.7",
  "@vitejs/plugin-react": "^4.0.3",
  "typescript": "^5.0.2",
  "vite": "^4.4.5",
  "vite-plugin-pwa": "^0.16.4",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/postcss": "^4.1.11",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.27"
}
```

### Optional Enhancements (Currently Installed)
```json
{
  "react-icons": "^5.5.0"
}
```

## 🎯 Component Imports Used

### React Hooks (from 'react')
```typescript
import React, { useState, useMemo, useEffect } from "react";
```

### Icons (from 'lucide-react')
```typescript
import {
  Search,        // Search input fields
  Plus,          // Add buttons
  Trash2,        // Delete buttons  
  ArrowLeft,     // Back navigation
  Check,         // Confirmation/success states
  Minus,         // Quantity decrease
  ShoppingCart,  // Out of stock toggle
  RefreshCw,     // Reset/refresh actions
  Share2,        // Share functionality
  Download,      // Import actions
  Upload,        // CSV import
  Edit,          // Edit product (available but not currently used)
  X,             // Close modals/clear filters
  Copy,          // Copy to clipboard
  ChevronUp,     // Sort ascending
  ChevronDown,   // Sort descending
  MoreHorizontal,// More options (available but not currently used)
  Filter,        // Category filtering
} from "lucide-react";
```

### Alternative Icons (from 'react-icons') - Available for use
```typescript
// FontAwesome icons
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

// Material Design icons  
import { MdEmail, MdPhone, MdSettings } from 'react-icons/md';

// Ionicons
import { IoMdSettings, IoMdHome } from 'react-icons/io';
```

### Custom Components
```typescript
// PWAInstaller component (available but not currently used in main app)
import { PWAInstaller } from "./components/PWAInstaller";
```

## 🔧 Browser APIs Used

### Local Storage
```typescript
localStorage.getItem("gulu-lists")
localStorage.setItem("gulu-lists", JSON.stringify(lists))
```

### Clipboard API
```typescript
navigator.clipboard.writeText(text)
```

### Online/Offline Detection
```typescript
navigator.onLine
window.addEventListener('online', handleOnline)
window.addEventListener('offline', handleOffline)
```

### PWA Install Prompt
```typescript
window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
window.addEventListener('appinstalled', handleAppInstalled)
```

### File Reader API
```typescript
const reader = new FileReader()
reader.readAsText(file)
```

## 🎨 Tailwind CSS Classes Used

### Layout & Spacing
- `min-h-screen`, `max-w-4xl`, `mx-auto`, `p-6`, `px-4`, `py-2`
- `flex`, `grid`, `space-y-4`, `space-y-6`, `gap-2`, `gap-4`

### Typography
- `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`
- `font-medium`, `font-semibold`

### Colors
- `bg-white`, `bg-gray-50`, `bg-gray-100`, `bg-red-50`
- `text-gray-600`, `text-gray-900`, `text-teal-600`
- `border-gray-200`, `border-gray-300`

### Interactive States
- `hover:bg-gray-100`, `hover:text-gray-800`, `hover:shadow-lg`
- `focus:outline-none`, `focus:ring-2`, `focus:ring-teal-500`
- `transition-colors`, `transition-shadow`, `transition-all`

### Responsive Design
- `grid-cols-1` (products use single column layout)
- Touch-friendly buttons with `touch-manipulation`

## 📱 PWA Features

### Service Worker (via Vite PWA Plugin)
- Automatic caching
- Offline functionality
- Background sync

### Web App Manifest
```json
{
  "name": "Gulu Inventory",
  "short_name": "Gulu Inventory",
  "display": "standalone",
  "theme_color": "#0f766e",
  "background_color": "#ffffff"
}
```

## 🚀 Quick Setup Commands

### Install Dependencies
```bash
npm install react react-dom lucide-react
npm install -D @types/react @types/react-dom @vitejs/plugin-react typescript vite vite-plugin-pwa tailwindcss @tailwindcss/postcss autoprefixer postcss
```

### Optional Enhancement
```bash
npm install react-icons
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔍 Optional Enhancements for Future

### Additional Icons You Might Want
```typescript
import {
  Settings,      // App settings
  User,          // User profile
  Bell,          // Notifications
  Menu,          // Mobile menu
  Calendar,      // Date picking
  Tag,           // Category tags
  Image,         // Image placeholders
  FileText,      // Export functionality
  Heart,         // Favorites
  Star,          // Ratings
} from "lucide-react";
```

### Potential Libraries for Future Features
```bash
# Date handling
npm install date-fns

# Form validation
npm install zod react-hook-form

# State management (if app grows)
npm install zustand

# Charts/analytics
npm install recharts

# Toast notifications
npm install sonner

# Animation library
npm install framer-motion
```

## 🎯 Current Component Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx             # React app entry point
├── components/
│   └── PWAInstaller.tsx # PWA installation prompt
└── styles/
    └── globals.css      # Tailwind CSS configuration

Config Files:
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.ts       # Vite build configuration
└── tsconfig.json        # TypeScript configuration
```

## ⚡ Performance Notes

- **Bundle Size**: Current setup is lightweight (~200KB with React + icons)
- **PWA**: Cacheable for offline use
- **Images**: Uses Unsplash for product images (external dependency)
- **Data**: All data stored in localStorage (no backend required)
- **Icons**: Tree-shaking enabled - only imports used icons
- **CSS**: Tailwind purges unused styles in production

## 🛠 Troubleshooting

### Common Import Issues
1. **Lucide Icons**: Ensure `lucide-react` is installed
2. **TypeScript**: Ensure all type definitions are installed
3. **CSS**: Ensure Tailwind is properly configured in `vite.config.ts`
4. **PostCSS**: Ensure `@tailwindcss/postcss` plugin is installed for Tailwind v4

### PWA Issues
1. **Manifest 404**: Ensure `manifest.json` exists in `/public`
2. **Icons Missing**: Ensure icon files exist in `/public`
3. **Service Worker**: Check Vite PWA plugin configuration

### Build Issues
1. **Tailwind v4**: Use `@tailwindcss/postcss` instead of `tailwindcss` in PostCSS config
2. **TypeScript**: Set `"noUnusedLocals": false` if you have imports for future use
3. **Vite**: Ensure all plugins are compatible versions

## ✅ Current Status (Verified Working)

- ✅ React 18.2.0
- ✅ Lucide React icons (19 icons imported)
- ✅ React Icons (available for use)
- ✅ Tailwind CSS v4 with PostCSS
- ✅ TypeScript compilation
- ✅ PWA functionality
- ✅ Vite build system
- ✅ Hot module replacement
- ✅ Offline detection
- ✅ Local storage persistence
- ✅ Clipboard API
- ✅ File upload/CSV import
- ✅ Service worker generation

All dependencies are properly installed and configured! 🎉
