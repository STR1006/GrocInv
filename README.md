# Gulu Inventory

A progressive web app (PWA) grocery list app designed to make employees' jobs easier for stocking shelves. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📱 **Progressive Web App** - Install on mobile and desktop
- 🔄 **Offline Support** - Works without internet connection
- 📊 **Progress Tracking** - Visual progress bars for completion status
- 🔍 **Search & Filter** - Find products and lists quickly
- 🏷️ **Categories** - Organize products by category
- 📤 **Share Lists** - Share via codes between users
- 📁 **CSV Import** - Import product lists from CSV files
- ✅ **Completion Tracking** - Mark products as done with timestamps
- 📦 **Stock Management** - Track out-of-stock items
- 🎨 **Clean Design** - Minimalist teal-themed interface

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Vite** for build tooling
- **Vite PWA Plugin** for service worker and manifest
- **Lucide React** for icons
- **LocalStorage** for data persistence

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gulu-inventory.git
   cd gulu-inventory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Deployment Options

### GitHub Pages

1. **Enable GitHub Pages** in repository settings
2. **Add deployment workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Vercel

1. **Connect GitHub repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

### Netlify

1. **Connect GitHub repository** to Netlify
2. **Build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

## Usage

### Creating Lists

1. Click "New List" to create a grocery list
2. Add products with optional categories, images, and comments
3. Use the search and filter features to manage large lists

### Managing Products

- **Add quantities** using +/- buttons
- **Mark as done** when restocking is complete
- **Mark out of stock** to move items to bottom of list
- **Edit products** by clicking on product cards
- **Reset quantities** using the refresh button

### Importing Data

- **CSV Import**: Upload CSV files with format: `Product Name, Category, Image URL, Comment`
- **Share Codes**: Import lists shared by other users

### Sorting & Filtering

- Sort lists by name, date, or item count
- Sort products by name, category, quantity, completion, or stock status
- Filter products by category
- Search for specific products or lists

## PWA Features

The app is a fully functional Progressive Web App:

- **Installable** on mobile and desktop devices
- **Offline functionality** with service worker caching
- **App-like experience** with standalone display mode
- **Automatic updates** when new versions are available

## Data Storage

All data is stored locally in the browser's localStorage:
- Lists and products persist between sessions
- No server required for basic functionality
- Data syncing would require additional backend implementation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)