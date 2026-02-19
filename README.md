# Smart Bookmark App

A simple real-time bookmark manager built using Next.js (App Router) and Supabase.

---

## 🚀 Live Demo

🔗 https://smart-bookmark-app-parthas-projects-10dcc164.vercel.app/

---

## 💻 GitHub Repository

🔗 https://github.com/PARTHA-PATTANAYAK-02/smart-bookmark-app

---

## 🚀 Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase
- Google OAuth Authentication
- PostgreSQL Database
- Realtime (Postgres Changes)
- Tailwind CSS
- Vercel (Deployment)

---

## ✨ Features

- Google OAuth login (no email/password)
- User-specific private bookmarks (RLS enabled)
- Add bookmarks (Title + URL)
- Delete bookmarks
- Realtime sync across multiple tabs
- Logout functionality
- Deployed live on Vercel

---

## 🔒 Security (RLS)

Row Level Security is enabled on the `bookmarks` table:

- Users can only view their own bookmarks
- Users can only insert their own bookmarks
- Users can only delete their own bookmarks

Policy condition used:

auth.uid() = user_id

---

## ⚡ Realtime Implementation

- Used Supabase Postgres Changes for realtime updates
- Subscribed to database events
- Enabled cross-tab synchronization
- Implemented refetch-based approach for stability

---

## 🧠 Challenges Faced & Solutions

### 1️⃣ OAuth Redirect Issue in Production

After deployment, login was redirecting to `localhost` instead of the live site.

**Solution:**  
Used dynamic redirect URL:

```js
redirectTo: `${window.location.origin}/auth/callback`;
```

Also configured correct redirect URLs in Supabase.

2️⃣ Realtime Delete Not Syncing Across Tabs

Delete events were not updating in other tabs.

Solution:
Used a universal realtime listener (event: "\*") and refetched bookmarks to ensure consistency.

3️⃣ Duplicate Entries / State Conflicts

Optimistic updates + realtime caused duplicate or disappearing bookmarks.

Solution:
Simplified state management and avoided conflicting updates.

4️⃣ React Strict Mode Warning

Encountered "setState in useEffect" warning.

Solution:
Refactored logic using async functions inside useEffect.

📝 What I Learned

Implementing Google OAuth using Supabase

Using Row Level Security (RLS) for secure user data

Handling realtime updates with Supabase

Managing React state without race conditions

Deploying full-stack apps on Vercel

🛠️ Run Locally

Clone the repository:

git clone https://github.com/PARTHA-PATTANAYAK-02/smart-bookmark-app

Install dependencies:

npm install

Create .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Run the development server:

npm run dev
📌 Submission Notes

This project fulfills all requirements:

Google OAuth authentication only

Private bookmarks per user (RLS)

Add and delete functionality

Realtime cross-tab updates

Deployed on Vercel

Public GitHub repository

README with problems and solutions

🙌 Final Thoughts

This project demonstrates full-stack development skills including authentication, database security, realtime systems, and deployment.

---
