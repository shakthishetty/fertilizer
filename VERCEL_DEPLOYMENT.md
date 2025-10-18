# Vercel Deployment Guide

This application has been restructured for deployment on Vercel's serverless platform.

## 🏗️ Architecture Overview

The application now uses a **dual-structure approach**:

### For Vercel (Production):
- **Frontend**: Static Vite build served from `client/dist/`
- **Backend**: Serverless Express functions in `api/` folder
- **API Routes**: All backend routes are prefixed with `/api`

### For Replit (Development):
- **Original structure** in `server/` folder still works for local development
- Run `npm run dev` to use the Replit-optimized server

---

## 📁 New File Structure

```
root/
├── api/                      # Vercel serverless backend
│   ├── index.ts             # Main Express app export (no app.listen)
│   ├── routes.ts            # API route handlers
│   └── lib/
│       └── storage.ts       # Data storage layer
├── client/                   # Frontend (Vite + React)
│   ├── src/
│   ├── dist/                # Build output (created by `npm run build`)
│   └── index.html
├── server/                   # Original Replit server (keep for dev)
├── shared/                   # Shared types and data
├── vercel.json              # Vercel configuration
├── vite.config.ts           # Vite build config
└── package.json
```

---

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Restructured for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `client/dist` (auto-configured via vercel.json)
   - Install Command: `npm install` (auto-detected)

4. **Add Environment Variables** (if any)
   - Go to Project Settings → Environment Variables
   - Add any required variables (see section below)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

---

## 🔧 Environment Variables

If your application uses environment variables, add them in Vercel:

**Vercel Dashboard:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable

**Common Variables You May Need:**
```
DATABASE_URL=<your-database-connection-string>
NODE_ENV=production
```

**Note:** Frontend environment variables must be prefixed with `VITE_` to be accessible:
```
VITE_API_URL=https://your-app.vercel.app/api
```

---

## 🧪 Testing Locally with Vercel Dev

You can test the Vercel deployment locally:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Run Vercel dev server
vercel dev
```

This will:
- Start the Vite dev server for frontend
- Run the serverless API functions locally
- Simulate the Vercel production environment

---

## 🔍 Verifying Deployment

After deployment, test these endpoints:

1. **Frontend**: `https://your-app.vercel.app`
2. **API Health Check**: `https://your-app.vercel.app/api/fertilizer/metrics`

---

## ⚠️ Important Notes

### Serverless Limitations

1. **No Persistent State**: Each API request runs in a separate serverless function instance
   - Session storage is handled in-memory (resets between deployments)
   - For production, consider using external session storage (Redis, database)

2. **WebSocket Limitations**: Vercel serverless functions don't support long-lived WebSocket connections
   - If you need WebSockets, consider Vercel Edge Functions or a different platform

3. **Cold Starts**: First request may be slower due to serverless cold start

### Differences from Replit

| Feature | Replit | Vercel |
|---------|--------|--------|
| Server Type | Single Express server | Serverless functions |
| Port | 5000 | N/A (handled by Vercel) |
| Static Files | Served by Express | Served by Vercel CDN |
| API Prefix | `/api` | `/api` ✅ |
| Build Output | `dist/public` | `client/dist` |

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Cannot find module 'vite'`
- **Solution**: Make sure all dependencies are in `package.json` dependencies (not devDependencies for build-time packages)

### API Returns 404

**Error**: API routes not found
- **Solution**: Verify all API routes start with `/api` prefix
- **Check**: `vercel.json` routing configuration is correct

### Frontend Shows Blank Page

**Error**: White screen on deployment
- **Solution**: Check browser console for errors
- **Verify**: Build output is in `client/dist` folder
- **Check**: All frontend asset paths are relative (not absolute)

### "Module not found" Errors

**Error**: TypeScript import errors
- **Solution**: Run `npm install` to install dependencies
- **Check**: All imports use correct paths for the new `api/` structure

---

## 📝 Development Workflow

### For Vercel Development:
```bash
# Build frontend
npm run build

# Test with Vercel dev
vercel dev
```

### For Replit Development:
```bash
# Use original server structure
npm run dev
```

---

## 🔄 Keeping Both Environments

You can maintain both structures:

- **`api/` folder**: For Vercel production deployment
- **`server/` folder**: For Replit development

Just keep them in sync when making changes to routes or business logic.

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Deploying Vite Apps](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
