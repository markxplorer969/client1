# Deployment Guide

This guide will help you deploy Yilzi Digitalz to various hosting platforms.

## 📋 Prerequisites

- Node.js 18+ or Bun installed
- Git account (GitHub, GitLab, or Bitbucket)
- Firebase project created (already configured)
- Payment gateway account (Tripay or similar)

## 🔐 Required Environment Variables

Create these environment variables on your deployment platform:

### Firebase Client (Required)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAcyvb7g9dzgXSzM60dove1Km67uGKXB3c
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sadiwa-store-web.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sadiwa-store-web
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sadiwa-store-web.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=487223004054
NEXT_PUBLIC_FIREBASE_APP_ID=1:487223004054:web:e5e7af920aea87faf66bb7
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8TT3333WDH
```

### Firebase Admin (Required)
```env
FIREBASE_ADMIN_PROJECT_ID=sadiwa-store-web
FIREBASE_ADMIN_PRIVATE_KEY_ID=YOUR_PRIVATE_KEY_ID
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@sadiwa-store-web.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=103062245964563067636
```

### Application (Required)
```env
NEXT_PUBLIC_APP_NAME=Yilzi Digitalz
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ADMIN_EMAIL=markxplorer969@gmail.com
```

### Payment Gateway (Tripay)
```env
NEXT_PUBLIC_TRIPAY_API_KEY=YOUR_TRIPAY_API_KEY
NEXT_PUBLIC_TRIPAY_MODE=sandbox  # Change to 'production' when live
```

---

## 🚀 Deployment Platforms

### 1. Vercel (Recommended)

#### Steps:
1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.`
   - **Build Command**: `npm run build` (or `bun run build`)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install` (or `bun install`)
6. Add Environment Variables:
   - Go to Settings > Environment Variables
   - Add all the required variables listed above
7. Click "Deploy"

#### Post-Deployment:
1. Go to your project settings
2. Check if custom domain is configured
3. Monitor deployment logs for any errors
4. Test all functionality (login, payment, etc.)

#### Vercel-Specific Tips:
- Free tier is sufficient for most projects
- Automatic HTTPS is enabled
- Automatic CDN is enabled
- Build time limit: 10 minutes (free), 60 minutes (pro)
- Serverless functions have 10-second timeout for free tier
- For Firebase Admin, ensure environment variables are set correctly

---

### 2. Netlify

#### Steps:
1. Push code to GitHub/GitLab repository
2. Go to [netlify.com](https://netlify.com) and sign up/login
3. Click "Add new site" > "Import an existing project"
4. Select your provider (GitHub/GitLab/Bitbucket)
5. Choose repository
6. Configure build settings:
   - **Build command**: `npm run build` (or `bun run build`)
   - **Publish directory**: `.next`
   - **Node version**: 18 (or latest)
7. Click "Show advanced" and add environment variables
8. Click "Deploy site"

#### Post-Deployment:
1. Check your Netlify dashboard
2. Add custom domain if needed
3. Configure redirects if needed
4. Monitor function logs for any errors

#### Netlify-Specific Tips:
- Use Netlify Functions for API routes (automatically detected)
- Free tier includes 100GB bandwidth/month
- Automatic HTTPS
- Build time limit: 15 minutes
- Consider upgrading to Pro for faster builds and more bandwidth

---

### 3. Cloudflare Pages

#### Steps:
1. Push code to GitHub repository
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Go to "Workers & Pages" > "Create application" > "Pages" > "Connect to Git"
4. Select GitHub and authorize
5. Choose repository and branch
6. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build command**: `npm run build` (or `bun run build`)
   - **Output directory**: `.next`
   - **Node.js version**: 18
7. Add environment variables in "Settings" > "Environment variables"
8. Click "Save and Deploy"

#### Cloudflare Pages-Specific Tips:
- Fastest global CDN
- Unlimited bandwidth
- Automatic HTTPS
- Serverless functions may have cold starts
- Free tier includes 500 builds/month

---

### 4. AWS Amplify

#### Steps:
1. Push code to GitHub/GitLab/Bitbucket repository
2. Go to [console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify)
3. Click "New app" > "Host web app"
4. Select your provider and repository
5. Configure build settings:
   - **Repository**: Your repo
   - **Branch**: main (or master)
   - **Build settings**: Edit settings
     - **Build command**: `npm run build` (or `bun run build`)
     - **Output directory**: `.next`
6. Add environment variables in "Environment variables"
7. Click "Save and deploy"

#### AWS Amplify-Specific Tips:
- Free tier includes 12 months hosting
- Automatic HTTPS
- CI/CD pipeline included
- Easy to configure custom domain
- Consider setting up S3 for static assets

---

### 5. Railway

#### Steps:
1. Push code to GitHub repository
2. Go to [railway.app](https://railway.app) and sign up/login
3. Click "New Project" > "Deploy from GitHub repo"
4. Select repository and branch
5. Configure build settings:
   - **Build Command**: `npm run build` (or `bun run build`)
   - **Start Command**: `npm start` (or `bun start`)
   - **Root Directory**: `.`
6. Add environment variables in "Variables"
7. Click "Deploy"

#### Railway-Specific Tips:
- Free tier: $5 credit/month (sufficient for small projects)
- Automatic HTTPS
- Easy to add databases
- Good for full-stack applications
- Consider upgrading to Pro for better performance

---

### 6. Render

#### Steps:
1. Push code to GitHub repository
2. Go to [render.com](https://render.com) and sign up/login
3. Click "New +" > "Web Service"
4. Connect your GitHub repository
5. Configure build settings:
   - **Name**: yilzi-digitalz
   - **Branch**: main (or master)
   - **Build Command**: `npm run build` (or `bun run build`)
   - **Start Command**: `npm start` (or `bun start`)
6. Add environment variables in "Environment"
7. Click "Create Web Service"

#### Render-Specific Tips:
- Free tier: 512MB RAM, 0.1 CPU (sufficient for small projects)
- Automatic HTTPS
- Auto-deploys on git push
- Dormant sites spin down after 15 minutes
- Free SSL certificate
- Consider upgrading for more resources

---

### 7. Docker Deployment

#### Steps:
1. Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy project files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

2. Build Docker image:
```bash
docker build -t yilzi-digitalz .
```

3. Run Docker container:
```bash
docker run -p 3000:3000 --env-file .env yilzi-digitalz
```

4. Push to Docker Hub (optional)

#### Docker-Specific Tips:
- Use multi-stage builds for smaller images
- Use Alpine Linux for smaller image size
- Don't run as root user in production
- Use Docker Compose for multi-container apps

---

## ⚠️ Important Notes

### Firebase Admin SDK
- Never commit your Firebase Admin private key to Git
- Use environment variables for all sensitive data
- The `next.config.ts` includes webpack config to handle Firebase Admin properly

### Environment Variables
- Use `.env.example` as a template
- Add real values to your platform's environment variables
- Never commit `.env` file to Git
- Mask sensitive values in deployment logs

### Database
- This project uses Firebase Firestore (no SQL database needed)
- Data is automatically persisted in Firebase
- No database migrations required

### File Uploads
- Firebase Storage is used for file uploads
- Ensure storage CORS is configured if needed
- Large files may require additional configuration

### Payment Gateway
- Tripay is configured via environment variables
- Sandbox mode for testing, production mode for live
- Handle webhooks properly for payment status updates

### Performance Tips
1. Enable image optimization in Next.js
2. Use ISR (Incremental Static Regeneration) for pages with data
3. Implement caching where appropriate
4. Minimize bundle size
5. Use CDN for static assets

### Security Tips
1. Enable HTTPS (automatic on most platforms)
2. Use environment variables for secrets
3. Implement rate limiting on API routes
4. Use Firebase Security Rules
5. Set CORS headers properly

---

## 🔧 Troubleshooting

### Build Fails
1. Check build logs for errors
2. Ensure all dependencies are installed
3. Verify Node.js/Bun version
4. Check TypeScript errors
5. Ensure environment variables are set

### Deployment Fails
1. Verify Firebase configuration
2. Check API routes are working
3. Ensure all environment variables are set
4. Check deployment logs for errors

### Firebase Errors
1. Verify Firebase Admin private key
2. Check Firebase project settings
3. Ensure authentication is properly configured
4. Check Firestore security rules

### Payment Issues
1. Verify Tripay API key is correct
2. Check sandbox vs production mode
3. Ensure webhook URL is correct
4. Test payment flow thoroughly

---

## 📞 Support

If you encounter issues:
1. Check platform-specific documentation
2. Review deployment logs
3. Check environment variables
4. Test locally before deploying
5. Contact platform support if needed

---

**Good luck with your deployment! 🚀**
