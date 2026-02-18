export const GENRES = [
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Thriller',
    'Romance',
    'Horror',
    'Historical Fiction',
    'Contemporary',
    'Young Adult',
    'Adventure',
    'Poetry',
    'Non-Fiction',
    'Biography',
    'Self-Help',
    'Other',
] as const

export type Genre = typeof GENRES[number]

export const FONT_FAMILIES = [
    { value: 'serif', label: 'Serif', class: 'font-serif' },
    { value: 'sans', label: 'Sans-serif', class: 'font-sans' },
    { value: 'mono', label: 'Monospace', class: 'font-mono' },
] as const

export const READER_THEMES = [
    { value: 'light', label: 'Light', bg: 'bg-white', text: 'text-gray-900' },
    { value: 'dark', label: 'Dark', bg: 'bg-gray-900', text: 'text-gray-100' },
    { value: 'sepia', label: 'Sepia', bg: 'bg-amber-50', text: 'text-amber-900' },
] as const

export const AI_PROMPTS = [
    { label: 'Improve this text', prompt: 'Please improve the following text while maintaining its meaning and style:' },
    { label: 'Generate outline', prompt: 'Generate a detailed chapter outline for:' },
    { label: 'Suggest dialogue', prompt: 'Suggest natural dialogue for this scene:' },
    { label: 'Expand section', prompt: 'Expand this section with more details and descriptions:' },
    { label: 'Fix grammar', prompt: 'Fix grammar and spelling errors in:' },
] as const
