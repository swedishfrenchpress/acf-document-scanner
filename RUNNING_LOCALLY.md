# Running Numo Site Locally

## Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd terminal-site
   ```

2. **Install dependencies (if you haven't already):**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to `http://localhost:3000`
   - If port 3000 is busy, Next.js will automatically use port 3001

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Troubleshooting

### Port Already in Use
If you see "Port 3000 is in use", another dev server is running. You can:

1. **Find and stop the process:**
   ```bash
   lsof -ti:3000 | xargs kill
   ```

2. **Or just use the next available port** (Next.js will tell you which one)

### Lock File Warning
If you see a warning about multiple lockfiles, you can ignore it - it's harmless. It's because there's a `package-lock.json` in the parent directory.

### Clean Build
If something seems wrong, try:
```bash
rm -rf .next
npm run build
```

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server (run after `npm run build`)
- `npm run lint` - Run ESLint




