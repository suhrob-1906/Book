# 🛠️ Manual Setup & Troubleshooting Guide

This guide addresses common issues with Supabase migrations and CLI installation on Windows.

## 1. Database Migration (Manual Method)

If the automated migration fails or you can't use the CLI, follow these steps to set up your database manually.

### Step 1.1: Get the SQL Code
1. Open the file `supabase/migrations/001_initial_schema.sql` in your code editor (VS Code).
2. Select everything (`Ctrl+A`) and copy it (`Ctrl+C`).

### Step 1.2: Run in Supabase Dashboard
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project (`book-creator`).
3. In the left sidebar, click on the **SQL Editor** icon (looks like a terminal `>_`).
4. Click **New Query** (top left).
   - *Note: If "New Query" doesn't appear or work, try refreshing the page or disabling ad-blockers temporarily.*
5. Paste the code into the editor.
6. Click **Run** (bottom right) or press `Ctrl+Enter`.
7. You should see a message: `Success. No rows returned.`

### Step 1.3: Verify Tables
1. Go to the **Table Editor** (icon looks like a grid/table).
2. You should see `profiles`, `books`, `chapters`, and `reading_progress` tables.

---

## 2. Deploying Edge Functions (Fixing "scoop not found")

The error `scoop : The term 'scoop' is not recognized` means you don't have the Scoop package manager installed. **You do not need Scoop.** You can use `npx` (which comes with Node.js) instead.

### Method A: Use NPX (Recommended)

1. Open your terminal in the project folder (`c:\Users\LENOVO\Downloads\Book_Creation_webapp`).
2. Run the following commands one by one:

**Login to Supabase:**
```powershell
npx supabase login
```
*It will verify via your browser. Follow the prompts.*

**Link your Project:**
```powershell
npx supabase link --project-ref YOUR_PROJECT_ID
```
*Replace `YOUR_PROJECT_ID` with your actual project reference (e.g., `abcdefghijklm`). You can find this in your Supabase Dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`.*

**Set Gemini API Key:**
```powershell
npx supabase secrets set GEMINI_API_KEY=your_actual_api_key_here
```

**Deploy the Function:**
```powershell
npx supabase functions deploy ai-chat
```

### Method B: Direct Download (Fallback)

If `npx` fails, you can download the Supabase CLI executable directly:

1. Go to the [Supabase CLI Releases](https://github.com/supabase/cli/releases/latest) page.
2. Download the version for Windows (e.g., `supabase_windows_amd64.tar.gz` or similar).
3. Extract the `supabase.exe` file.
4. Place `supabase.exe` in your project folder.
5. In your terminal, run `./supabase login`, `./supabase link ...`, etc.

---

## 3. Alternative: Skip Edge Functions (Temporary)

If you absolutely cannot get the Edge Function to deploy, the AI chat feature will not work.

**To continue developing the rest of the app without AI:**
1. You can skip the deployment of `ai-chat`.
2. The core features (Auth, Book Feed, Reading) **do not** depend on the Edge Function.
3. You can revisit this later when you have a working CLI.

---

## 4. Common Setup Issues

### "New Query" Button Issues
- Supabase Dashboard can be sensitive to browser extensions. Try opening it in **Incognito Mode**.

### "Relation 'profiles' does not exist"
- This means the migration didn't run. Go back to **Step 1.2** and verify the "Run" button was clicked and success message appeared.

### "Permission denied" errors in Terminal
- Try running your terminal (PowerShell or Command Prompt) as **Administrator**.
