# EduManager - School Management Dashboard

A modern, full-featured school management system built with React, TypeScript, and Supabase. EduManager helps educators efficiently manage students, teachers, classes, attendance, and fees in one unified platform.

## 🚀 Features

- **Dashboard** - Overview of key metrics (total students, teachers, classes, attendance rates)
- **Student Management** - Add, edit, delete, and search students with class assignments
- **Teacher Management** - Manage teacher profiles, qualifications, and subject assignments
- **Class Management** - Create and organize classes with teachers and schedules
- **Attendance Tracking** - Record and visualize student attendance patterns
- **Fee Management** - Track student fee payments and pending balances
- **Settings** - Configure school settings and system preferences
- **Authentication** - Secure login with Supabase Auth
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn-ui
- **Backend:** Supabase (PostgreSQL + Auth)
- **Data Fetching:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Routing:** React Router v6

## 📦 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn-ui components
│   ├── dashboard/      # Dashboard components
│   └── layout/         # Layout components
├── contexts/           # React Context (Auth state)
├── hooks/              # Custom hooks (data fetching, CRUD operations)
├── pages/              # Route pages
├── integrations/       # Supabase client & types
└── lib/               # Utility functions
```

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm))
- npm or bun
- Supabase account ([free at supabase.com](https://supabase.com))

### Setup

1. **Clone and navigate:**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd school-hub-dash-62
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` with Supabase credentials:**
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_public_key
   ```
   Find these in [Supabase Dashboard](https://app.supabase.com) > Project > Settings > API

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:8080`

## 📚 Available Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality with ESLint
npm test             # Run tests
npm test:watch       # Run tests in watch mode
```

## 🏗️ Architecture Highlights

### Custom Hooks with TanStack Query
Encapsulates data fetching and caching:
```typescript
// Efficiently manages students data
const { data: students, isLoading } = useStudents();
```

### Context API for Auth
Global authentication state without bloat:
```typescript
const { user, signIn, signOut } = useAuth();
```

### Protected Routes
Automatically redirects unauthenticated users to login.

### Component Composition
Large pages broken into smaller, reusable components for better maintainability.

## 🎨 Design System: shadcn-ui

Built on Radix UI primitives + Tailwind CSS:
- Semantically correct HTML
- Full keyboard navigation
- Built-in accessibility (ARIA)
- Customizable with Tailwind

Key components: Button, Table, Dialog, Form inputs, Card, Badge, Chart

## 🔐 Authentication

1. User logs in at `/auth`
2. Supabase handles password validation
3. JWT token stored securely
4. `AuthContext` tracks session
5. Protected routes check authentication

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Deploy to Popular Platforms
- **Vercel:** `vercel deploy`
- **Netlify:** Drag `dist/` folder
- **Traditional:** Upload `dist/` to your server

Ensure environment variables are set on the hosting platform.

## 💡 Code Quality Standards

This project maintains:
- **Strict TypeScript** - Catches type errors before runtime
- **ESLint** - Code consistency and best practices
- **Clean Naming** - Self-documenting code
- **Comments** - Complex logic explained
- **Component Structure** - Separation of concerns
- **Responsive Design** - Works on all devices

## 🤝 Contributing

Keep the codebase clean:
1. Follow existing structure and naming
2. Use proper TypeScript types
3. Add comments for complex logic
4. Test changes thoroughly
5. Keep components focused and reusable

## 📝 License

Educational and open source.
