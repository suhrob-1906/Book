# Book Creation Platform - Deployment Guide

## 📋 Prerequisites

Before deploying, you'll need:
1. **Gemini API Key** (Free)
2. **Supabase Account** (Free)
3. **Render Account** (Free)

---

## 🤖 Step 1: Get Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy your API key (starts with `AIza...`)
5. **Save it securely** - you'll need it later!

> [!TIP]
> The free tier includes:
> - 60 requests per minute
> - 1,500 requests per day
> - Perfect for development and small projects!

---

## 🗄️ Step 2: Setup Supabase

### 2.1 Create Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `book-creator` (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
5. Wait 2-3 minutes for project to be ready

### 2.2 Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see "Success. No rows returned"

### 2.3 Create Storage Buckets

1. Go to **Storage** in the sidebar
2. Click **"Create a new bucket"**
3. Create first bucket:
   - **Name**: `avatars`
   - **Public**: ✅ Yes
   - **File size limit**: 2 MB
   - **Allowed MIME types**: `image/*`
4. Create second bucket:
   - **Name**: `book-covers`
   - **Public**: ✅ Yes
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/*`

### 2.4 Get Supabase Credentials

1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## 🚀 Step 3: Deploy Edge Function (AI Chat)

### 3.1 Install Supabase CLI

```bash
# Windows (PowerShell)
scoop install supabase

# Or download from https://github.com/supabase/cli/releases
```

### 3.2 Login to Supabase

```bash
supabase login
```

### 3.3 Link Your Project

```bash
cd c:\Users\LENOVO\Downloads\Book_Creation_webapp
supabase link --project-ref YOUR_PROJECT_REF
```

> Replace `YOUR_PROJECT_REF` with your project ID (found in Supabase dashboard URL)

### 3.4 Set Gemini API Key Secret

```bash
supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

> Replace `YOUR_GEMINI_API_KEY_HERE` with the API key from Step 1

### 3.5 Deploy the Function

```bash
supabase functions deploy ai-chat
```

---

## 🌐 Step 4: Deploy Frontend to Render

### 4.1 Prepare Environment Variables

1. Open `.env` file in your project
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.2 Build Locally (Test)

```bash
npm run build
```

If successful, you'll see a `dist` folder created.

### 4.3 Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with GitHub, GitLab, or email

### 4.4 Deploy to Render

#### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **In Render Dashboard:**
   - Click **"New +"** > **"Static Site"**
   - Connect your GitHub account
   - Select your repository
   - Configure:
     - **Name**: `book-creator` (or your choice)
     - **Branch**: `main`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`

3. **Add Environment Variables:**
   - Click **"Advanced"**
   - Add environment variables:
     - Key: `VITE_SUPABASE_URL`, Value: Your Supabase URL
     - Key: `VITE_SUPABASE_ANON_KEY`, Value: Your Supabase anon key

4. **Deploy:**
   - Click **"Create Static Site"**
   - Wait 2-3 minutes for deployment

#### Option B: Deploy Manually (Without Git)

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **In Render Dashboard:**
   - Click **"New +"** > **"Static Site"**
   - Choose **"Deploy an existing project from a Git repository"**
   - Or use **Render CLI** (see below)

3. **Using Render CLI:**
   ```bash
   # Install Render CLI
   npm install -g render-cli
   
   # Login
   render login
   
   # Deploy
   render deploy
   ```

### 4.5 Configure Custom Domain (Optional)

1. In your Render dashboard, go to your static site
2. Click **"Settings"**
3. Scroll to **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Follow the instructions to configure DNS

---

## ✅ Step 5: Verify Deployment

1. Visit your Render URL (e.g., `https://book-creator.onrender.com`)
2. Test the following:
   - ✅ Sign up with email/password
   - ✅ Login works
   - ✅ View feed page
   - ✅ Animations are smooth
   - ✅ Particles are interactive

---

## 🔧 Troubleshooting

### "Supabase credentials not found"
- Make sure you added environment variables in Render
- Redeploy after adding variables
- Check that variable names start with `VITE_`

### "Failed to fetch" errors
- Check Supabase URL is correct
- Verify RLS policies are applied
- Check browser console for specific errors
- Ensure CORS is configured in Supabase

### Build fails on Render
- Check build command is correct: `npm install && npm run build`
- Verify publish directory is `dist`
- Check Node.js version (Render uses Node 18 by default)
- View build logs in Render dashboard

### AI Chat not working
- Verify Gemini API key is set in Supabase secrets
- Check Edge Function is deployed: `supabase functions list`
- View function logs: `supabase functions logs ai-chat`

### Storage upload fails
- Verify buckets are created and public
- Check file size limits
- Ensure storage policies are applied

### Animations not working
- Clear browser cache
- Check that all dependencies installed correctly
- Verify build completed without errors

---

## 🆚 Render vs Vercel

| Feature | Render | Vercel |
|---------|--------|--------|
| **Free Tier** | ✅ 100GB bandwidth/month | ✅ 100GB bandwidth/month |
| **Build Minutes** | ✅ 500 minutes/month | ✅ 6000 minutes/month |
| **Auto Deploy** | ✅ Yes | ✅ Yes |
| **Custom Domains** | ✅ Free | ✅ Free |
| **SSL** | ✅ Free | ✅ Free |
| **CDN** | ✅ Global | ✅ Global |
| **Best For** | Full-stack apps | Frontend apps |

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [React Router Documentation](https://reactrouter.com)

---

## 🎉 You're Done!

Your book creation platform is now live on Render! Share the URL with friends and start writing! 📖✨

**Your app URL:** `https://your-app-name.onrender.com`

