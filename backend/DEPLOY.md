# Deploy Backend to Render.com

Follow these steps to deploy your e-commerce backend to Render:

## Prerequisites

1. Create a free account at [render.com](https://render.com)
2. Connect your GitHub account to Render
3. Push your code to a GitHub repository

## Deployment Steps

### 1. Push to GitHub

First, ensure your backend code is pushed to GitHub:

```bash
cd /home/arbi/project/e-commerce-test-2
git init
git add .
git commit -m "Initial commit - e-commerce backend"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `ecommerce-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Add Environment Variables

In the Render dashboard, add these environment variables:

- `NODE_ENV` = `production`
- `JWT_SECRET` = (generate a strong random string, e.g., from [randomkeygen.com](https://randomkeygen.com/))
- `PORT` = `10000` (Render default)

### 4. Deploy

Click "Create Web Service" and wait for deployment to complete (~2-5 minutes).

### 5. Get Your Backend URL

Once deployed, Render will provide you with a URL like:
```
https://ecommerce-backend-xxxx.onrender.com
```

**Copy this URL!** You'll need it for the next step.

## Update Frontend Configuration

After deployment, update the frontend to use your deployed backend:

1. Open `/home/arbi/project/e-commerce-test-2/frontend/.env.production`
2. Replace the placeholder with your actual Render URL:
   ```
   VITE_API_URL=https://your-actual-backend-url.onrender.com/api
   ```

3. Rebuild and redeploy frontend:
   ```bash
   cd /home/arbi/project/e-commerce-test-2/frontend
   npm run deploy
   ```

## Testing Your Deployment

1. Wait 1-2 minutes for your site to fully propagate
2. Visit: https://Arbigannouni.github.io/commerce/
3. Try:
   - Register a new account
   - Browse products
   - Add items to cart
   - Complete checkout

## Important Notes

⚠️ **Free Tier Limitations:**
- Render's free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- SQLite database is stored in-memory, so data resets on redeploy
- For production, upgrade to paid tier with PostgreSQL

🔒 **CORS is configured** to allow requests from `https://arbigannouni.github.io`

📊 **Monitor your deployment** at the Render dashboard for logs and metrics
