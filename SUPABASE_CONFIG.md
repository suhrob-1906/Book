# Supabase Configuration Fix

## Problem
When you click the email confirmation link, it redirects you to `localhost`. This is because Supabase defaults to localhost for development.

## Solution

1. Go to your **Supabase Dashboard** (https://supabase.com/dashboard).
2. Open your Project.
3. Go to **Authentication** (icon on the left) -> **URL Configuration**.
4. Look for **Site URL**.
5. Change it from `http://localhost:5173` to your **Render URL**.
   - Example: `https://your-project-name.onrender.com`
6. Click **Save**.

## Testing
1. Send a new confirmation email (or register a new user).
2. Click the link.
3. It should now take you to your live site, not localhost.
