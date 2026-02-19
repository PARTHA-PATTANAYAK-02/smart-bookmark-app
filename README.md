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

- **Next.js (App Router)**
- **TypeScript**
- **Supabase**
  - Google OAuth Authentication
  - PostgreSQL Database
  - Realtime (Postgres Changes)
- **Tailwind CSS**
- **Vercel (Deployment)**

---

## ✨ Features

- 🔐 Google OAuth login (no email/password)
- 👤 User-specific private bookmarks (RLS enabled)
- ➕ Add bookmarks (Title + URL)
- ❌ Delete bookmarks
- ⚡ Realtime sync across multiple tabs
- 🚪 Logout functionality
- 🌐 Deployed live on Vercel

---

## 🔒 Security (RLS)

Row Level Security is enabled on the `bookmarks` table:

- Users can only view their own bookmarks
- Users can only insert their own data
- Users can only delete their own bookmarks

Implemented using:

