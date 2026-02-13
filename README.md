# Smart Bookmark

🔗 Live Demo: https://smart-bookmark-dftaapjwp-rasika-deshmukhs-projects.vercel.app?_vercel_share=FiTKg5JACe0gMZx1XGOVooFBt8XaHAZH

## Overview

Smart Bookmark is a minimal authenticated bookmark manager built using Next.js and Supabase.  
Users can securely log in with Google, add bookmarks, and manage their personal collection in a clean dashboard interface.

The goal of this assignment was to demonstrate:

- Authentication handling
- Protected routes
- Database integration
- Production deployment
- Clean UI/UX with zero console errors

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Authentication + Database)
- Tailwind CSS
- Vercel (Production Deployment)

---

## Features

- Google Authentication (via Supabase)
- Protected Dashboard Route
- Add Bookmark (Title + URL)
- Delete Bookmark
- User-specific data storage
- Production deployment on Vercel
- Clean UI with improved visual hierarchy
- Zero console errors

---

## Challenges Faced & How I Solved Them

### 1. Environment Variables Not Working in Production

**Issue:**  
- The deployment failed on Vercel with a Supabase error:

    "Your project's URL and API key are missing"

    
**Cause:**  
Vercel does not use `.env.local` automatically. Production builds require environment variables to be configured in the Vercel dashboard.

**Solution:**  
I added:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

inside:
Then redeployed the project successfully.

--------------------------------------------------------------------------------------

### 2. Supabase SSR / Prerender Error on `/dashboard`

**Issue:**  
The build failed during prerendering of the `/dashboard` route.

**Cause:**  
Supabase client initialization required environment variables during build time. Since they were missing, the static generation failed.

**Solution:**  
After correctly configuring environment variables in Vercel, the prerender step completed successfully.

--------------------------------------------------------------------------

### 3. Git Not Recognized in Terminal

**Issue:**  
While initializing the repository, the terminal returned:

**Cause:**  
Git was installed but not added to the system PATH.

**Solution:**  
Reinstalled Git and ensured:
“Git from the command line and also from 3rd-party software” was selected during installation.  
Restarted terminal and verified using:

-----------------------------------------------------------------------------

### 4. UI Visibility & Visual Hierarchy

**Issue:**  
Text elements such as bookmark titles and section headers had insufficient contrast on darker backgrounds.

**Solution:**  
Adjusted Tailwind color classes to use slightly darker greys and improved contrast.  
Added subtle visual enhancements (logo placement and refined spacing) to improve clarity and intentional design.

------------------------------------------------------------------------------

### 5. Route Protection & Direct URL Access

**Issue:**  
Users could attempt direct navigation to `/dashboard`.

**Solution:**  
Implemented proper authentication checks so that:
- Unauthenticated users cannot access protected routes
- Sessions are validated before rendering dashboard content

---------------------------------------------------------------
## How to Run Locally

1. Clone the repository
  https://github.com/Rask133/smart-bookmark.git

2. Create a `.env.local` file in the root directory:

   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=


3. Install dependencies
   -npm install


4. Start development server

npm run dev

--------

## Future Improvements

- Edit bookmark functionality
- Form validation improvements
- Loading skeleton states
- Pagination for large bookmark lists
- Improved error handling UX

-------------

## Conclusion

This project demonstrates full-stack integration using Next.js and Supabase, including authentication, protected routes, database operations, and production deployment on Vercel.

Special focus was given to:
- Clean UX
- Error-free builds
- Proper environment management
- Professional deployment workflow
