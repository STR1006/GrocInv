# GitHub Setup Guide for Gulu Inventory

## Method 1: Using VS Code (Recommended)

### Prerequisites
- Git installed on your computer
- GitHub account
- VS Code with Git integration (built-in)

### Step 1: Clean Up Project Structure
Before uploading, let's remove duplicate files:

```bash
# Delete duplicate files in root directory
rm App.tsx
rm -r components/
rm -r styles/
rm -r utils/
```

### Step 2: Initialize Git Repository (In VS Code Terminal)

1. **Open Terminal in VS Code**: `Ctrl+`` (backtick) or `View > Terminal`

2. **Initialize Git repository**:
   ```bash
   git init
   ```

3. **Add all files**:
   ```bash
   git add .
   ```

4. **Create initial commit**:
   ```bash
   git commit -m "Initial commit: Gulu Inventory PWA with category support"
   ```

### Step 3: Create GitHub Repository

**Option A: Using GitHub CLI (if installed)**
```bash
gh repo create gulu-inventory --public --description "A grocery list PWA for inventory management"
gh repo view --web
```

**Option B: Using GitHub Website**
1. Go to [github.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Repository name: `gulu-inventory`
4. Description: "A grocery list PWA for inventory management"
5. Set to Public or Private
6. **DO NOT** check "Add a README file" (we already have one)
7. Click "Create repository"

### Step 4: Connect Local Repository to GitHub

1. **Copy the repository URL** from GitHub (should look like: `https://github.com/yourusername/gulu-inventory.git`)

2. **Add remote origin**:
   ```bash
   git remote add origin https://github.com/yourusername/gulu-inventory.git
   ```

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Step 5: Using VS Code Git Integration (Alternative)

1. **Open Command Palette**: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)

2. **Type**: "Git: Initialize Repository" and select it

3. **Stage all changes**: 
   - Click the Source Control icon in sidebar (or `Ctrl+Shift+G`)
   - Click the "+" next to "Changes" to stage all files

4. **Commit changes**:
   - Type commit message: "Initial commit: Gulu Inventory PWA"
   - Click the checkmark or press `Ctrl+Enter`

5. **Publish to GitHub**:
   - Click "Publish to GitHub" button in Source Control panel
   - Choose "Publish to GitHub public repository"
   - Select repository name and confirm

---

## Method 2: GitHub Desktop (Easier for Beginners)

### Step 1: Download GitHub Desktop
- Go to [desktop.github.com](https://desktop.github.com)
- Download and install GitHub Desktop
- Sign in with your GitHub account

### Step 2: Add Your Project
1. Click "Add an Existing Repository from your Hard Drive"
2. Choose your project folder
3. Click "create a repository" if prompted

### Step 3: Make Initial Commit
1. Review the files to be committed
2. Add commit summary: "Initial commit: Gulu Inventory PWA"
3. Click "Commit to main"

### Step 4: Publish to GitHub
1. Click "Publish repository"
2. Choose repository name: `gulu-inventory`
3. Add description
4. Choose public/private
5. Click "Publish Repository"

---

## Method 3: Drag and Drop (Quick but Limited)

### For Small Projects Only
1. Go to [github.com](https://github.com)
2. Create new repository
3. Click "uploading an existing file"
4. Drag and drop all your project files
5. Commit changes

**Note**: This method doesn't preserve Git history and is harder to manage later.

---

## Method 4: GitHub CLI (Command Line)

### Install GitHub CLI
```bash
# Windows (using winget)
winget install --id GitHub.cli

# macOS (using Homebrew)
brew install gh

# Linux (Ubuntu/Debian)
sudo apt install gh
```

### Setup and Upload
```bash
# Login to GitHub
gh auth login

# Create and push repository
gh repo create gulu-inventory --public --clone --description "A grocery list PWA for inventory management"
cd gulu-inventory

# Move your files here, then:
git add .
git commit -m "Initial commit: Gulu Inventory PWA"
git push origin main
```

---

## Post-Upload: Enable GitHub Pages (Optional)

### For Live Demo Deployment
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" section
4. Source: "Deploy from a branch"
5. Branch: "main" 
6. Folder: "/ (root)"
7. Click "Save"

### Your app will be available at:
`https://yourusername.github.io/gulu-inventory`

---

## Common Issues & Solutions

### Issue: "Repository already exists"
**Solution**: Choose a different name or delete the existing repository

### Issue: Authentication failed
**Solutions**:
- Use Personal Access Token instead of password
- Enable 2FA if required
- Use SSH keys for authentication

### Issue: Large files rejected
**Solution**: Remove large files or use Git LFS:
```bash
git lfs track "*.png"
git lfs track "*.jpg"
```

### Issue: Permission denied
**Solutions**:
- Check repository permissions
- Ensure you're the owner or have write access
- Use `git remote -v` to verify remote URL

---

## Next Steps After Upload

1. **Add collaborators** (if working with a team)
2. **Set up branch protection rules**
3. **Configure GitHub Actions** for CI/CD
4. **Add issue templates**
5. **Set up project boards** for task management

## Recommended VS Code Extensions

- **GitHub Pull Requests and Issues**
- **GitLens**
- **GitHub Repositories**
- **Git Graph**