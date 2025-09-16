# Konvertix website clone

*Automatically synced with your [v0.app](https://v0.app) deployments*

<!-- Test comment added by Devin to verify PR workflow -->

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/benjaminlauer33-9217s-projects/v0-konvertix-website-clone)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/BpYV1JzWmLn)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/benjaminlauer33-9217s-projects/v0-konvertix-website-clone](https://vercel.com/benjaminlauer33-9217s-projects/v0-konvertix-website-clone)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/BpYV1JzWmLn](https://v0.app/chat/projects/BpYV1JzWmLn)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Supabase Auth Setup

1. Create a project at https://supabase.com and copy your project URL and anon key.
2. Create a `.env.local` file at the project root or copy `.env.local.example` to `.env.local` and set:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Start the dev server: `npm run dev` and use the forms at `/auth/signup` and `/auth/login`.
4. Optional: Configure email templates and site URL in Supabase Auth settings for magic links.

## Storage (Documents) Setup

Per-user folders are used in the storage bucket, with the folder name equal to the user's id (UUID). Example:

```
documents/
  <user_id>/
    photo.png
    contract.pdf
```

To enforce this on the backend, run the SQL in `scripts/002_storage_policies.sql` in your Supabase SQL editor. Replace the bucket name if needed.

Environment:
- `NEXT_PUBLIC_SUPABASE_DOCUMENTS_BUCKET` (default: `documents`)

The Documents page lists files from `/${auth.uid()}/` and shows image previews. Make the bucket public for simple previews, or add a signed-URL API if private.
