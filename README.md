# 📚 Book Creation Platform

A modern, full-stack book creation and publishing platform built with React, TypeScript, Supabase, and Gemini AI.

## ✨ Features

- 🔐 **Authentication**: Secure email/password authentication with Supabase
- 📖 **Book Feed**: Discover and browse published books
- ✍️ **Book Editor**: Create and edit books with chapters
- 🤖 **AI Writing Assistant**: Get help from Gemini AI while writing
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎨 **Smooth Animations**: Powered by Framer Motion
- 🔒 **Row Level Security**: Secure data access with Supabase RLS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works!)
- Gemini API key (free from Google AI Studio)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Book_Creation_webapp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Create storage buckets: `avatars` and `book-covers` (both public)

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 📦 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Custom Animations
- **UI Components**: Custom components with shadcn/ui patterns
- **Animations**: Framer Motion
- **Backend**: Supabase (Auth + Database + Storage + Edge Functions)
- **AI**: Google Gemini API
- **Routing**: React Router v7
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation

## 🎨 Project Structure

```
Book_Creation_webapp/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components (Button, Input, Card, etc.)
│   │   └── auth/       # Authentication components
│   ├── pages/          # Page components (Auth, Feed, etc.)
│   ├── hooks/          # Custom React hooks (useAuth, etc.)
│   ├── lib/            # Utilities and configurations
│   │   ├── supabase.ts # Supabase client
│   │   ├── utils.ts    # Helper functions
│   │   └── constants.ts# App constants
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── supabase/
│   ├── migrations/     # Database migrations
│   └── functions/      # Edge Functions (AI chat)
├── DEPLOYMENT.md       # Detailed deployment guide
└── package.json
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:

- How to get a free Gemini API key
- Setting up Supabase production
- Deploying Edge Functions
- Deploying to Render (free tier available!)

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🎯 Current Status

✅ **Completed:**
- Project setup and configuration
- Authentication system
- Protected routes
- Core UI components
- Database schema and RLS policies
- Gemini AI Edge Function
- Deployment documentation

🚧 **In Progress:**
- Onboarding flow
- Book feed with real data
- Book editor
- Reader interface

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

## 📄 License

MIT License - feel free to use this project for learning and personal projects.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Amazing backend platform
- [Google Gemini](https://ai.google.dev) - Powerful AI API
- [Vercel](https://vercel.com) - Easy deployment
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Beautiful animations

---

Made with ❤️ and lots of ☕
