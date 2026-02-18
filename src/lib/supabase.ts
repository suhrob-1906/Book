import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Profile {
    user_id: string
    username: string
    full_name: string
    bio: string | null
    avatar_url: string | null
    interests: string[]
    age: number | null
    created_at: string
}

export interface Book {
    id: string
    author_id: string
    title: string
    description: string
    genre: string
    cover_url: string | null
    is_published: boolean
    created_at: string
    updated_at: string
    author?: Profile
}

export interface Chapter {
    id: string
    book_id: string
    title: string
    content: string
    chapter_number: number
    created_at: string
    updated_at: string
}

export interface ReadingProgress {
    id: string
    user_id: string
    book_id: string
    chapter_id: string
    progress_percentage: number
    last_read_at: string
}

// Helper functions
export async function uploadFile(
    bucket: string,
    path: string,
    file: File
): Promise<{ url: string | null; error: Error | null }> {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true,
            })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)

        return { url: publicUrl, error: null }
    } catch (error) {
        return { url: null, error: error as Error }
    }
}

export async function deleteFile(
    bucket: string,
    path: string
): Promise<{ error: Error | null }> {
    try {
        const { error } = await supabase.storage.from(bucket).remove([path])
        if (error) throw error
        return { error: null }
    } catch (error) {
        return { error: error as Error }
    }
}
