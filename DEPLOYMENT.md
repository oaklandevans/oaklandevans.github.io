# Deployment Instructions for GitHub Pages

## Automatic Deployment (Recommended)

This project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

### Setup Steps:

1. **Enable GitHub Pages in your repository settings:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **GitHub Actions**

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Set up React portfolio with GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - The GitHub Actions workflow will automatically build and deploy your site
   - Check the "Actions" tab in your repository to monitor progress
   - Once complete, your site will be live at: https://oaklandevans.github.io

## Manual Deployment (Alternative)

If you prefer to deploy manually:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder:**
   - Use GitHub Pages settings to deploy from a branch
   - Or use a tool like `gh-pages`:
     ```bash
     npm install -D gh-pages
     npx gh-pages -d dist
     ```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # React components (Keyboard)
├── pages/           # Page components (Home, KeyType)
├── styles/          # CSS files
├── utils/           # Utilities (keyMapping, paragraphs)
├── App.jsx          # Main app with routing
└── main.jsx         # App entry point
```

## Troubleshooting

- If routes don't work after deployment, ensure `base: '/'` is set in `vite.config.js`
- If assets don't load, check that the homepage in `package.json` matches your GitHub Pages URL
- Clear browser cache if changes don't appear after deployment
