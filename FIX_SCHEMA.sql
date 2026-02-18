-- SAFE SQL FIX - RUN THIS IN SUPABASE SQL EDITOR --

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Repair Profiles Table
DO $$ 
BEGIN
    -- Rename 'id' to 'user_id' if necessary
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id') THEN
        ALTER TABLE profiles RENAME COLUMN id TO user_id;
    END IF;

    -- Ensure required columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
        ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE profiles ADD COLUMN full_name TEXT;
    END IF;
END $$;

-- 3. Repair Books Table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'genre') THEN
        ALTER TABLE books ADD COLUMN genre TEXT DEFAULT 'Fiction';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'is_published') THEN
        ALTER TABLE books ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 4. Repair Chapters Table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chapters' AND column_name = 'chapter_number') THEN
        ALTER TABLE chapters ADD COLUMN chapter_number INTEGER;
    END IF;
END $$;

-- 5. Refresh RLS Policies (Safe approach: Drop then Create)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Published books are viewable by everyone" ON books;
DROP POLICY IF EXISTS "Users can insert their own books" ON books;
DROP POLICY IF EXISTS "Users can update their own books" ON books;
DROP POLICY IF EXISTS "Authors can delete their own books" ON books;

CREATE POLICY "Published books are viewable by everyone" ON books FOR SELECT USING (is_published = true OR auth.uid() = author_id);
CREATE POLICY "Users can insert their own books" ON books FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own books" ON books FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their own books" ON books FOR DELETE USING (auth.uid() = author_id);

-- 6. Enable RLS on everything
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
