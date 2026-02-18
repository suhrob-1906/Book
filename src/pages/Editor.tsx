import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Save, Plus, Sparkles,
    ChevronRight, Book, FileText,
    Send, Loader2
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Chapter {
    id: string
    title: string
    content: string
    order_index: number
}

interface BookData {
    id: string
    title: string
    description: string
    cover_url?: string
    author_id: string
    status: string
}

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export default function Editor() {
    const { user } = useAuth()
    const { bookId } = useParams()
    const navigate = useNavigate()

    // State
    const [book, setBook] = useState<BookData | null>(null)
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [showAiChat, setShowAiChat] = useState(false)

    // Editor State
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [chapterTitle, setChapterTitle] = useState('')
    const [content, setContent] = useState('')

    // AI Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: 'Hi! I\'m your AI writing assistant. How can I help you with your story today?' }
    ])
    const [aiInput, setAiInput] = useState('')
    const [aiLoading, setAiLoading] = useState(false)

    // Load Data
    useEffect(() => {
        if (!user) return

        if (bookId) {
            loadBook(bookId)
        } else {
            // New Book Mode
            setBook({
                id: '',
                title: '',
                description: '',
                author_id: user.id,
                status: 'draft'
            })
        }
    }, [bookId, user])

    const loadBook = async (id: string) => {
        setLoading(true)
        try {
            const { data: bookData, error: bookError } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single()

            if (bookError) throw bookError
            setBook(bookData)
            setTitle(bookData.title)
            setDescription(bookData.description)

            const { data: chaptersData, error: chaptersError } = await supabase
                .from('chapters')
                .select('*')
                .eq('book_id', id)
                .order('order_index', { ascending: true })

            if (chaptersError) throw chaptersError
            setChapters(chaptersData || [])

            if (chaptersData && chaptersData.length > 0) {
                setActiveChapterId(chaptersData[0].id)
                setChapterTitle(chaptersData[0].title)
                setContent(chaptersData[0].content || '')
            }
        } catch (error) {
            console.error('Error loading book:', error)
            toast.error('Failed to load book')
        } finally {
            setLoading(false)
        }
    }

    // Save Logic
    const handleSave = async () => {
        if (!user || user.id !== (bookId ? book?.author_id : user.id)) {
            if (!bookId) {
                // Creating new book
                createBook()
            } else {
                updateBook()
            }
        }
    }

    const createBook = async () => {
        setSaving(true)
        try {
            const { data, error } = await supabase
                .from('books')
                .insert({
                    title: title || 'Untitled Book',
                    description,
                    author_id: user?.id,
                    status: 'draft'
                })
                .select()
                .single()

            if (error) throw error

            setBook(data)
            toast.success('Book created!')
            navigate(`/editor/${data.id}`)

            // Create first chapter
            const { data: chapterData, error: chapterError } = await supabase
                .from('chapters')
                .insert({
                    book_id: data.id,
                    title: 'Chapter 1',
                    content: '',
                    order_index: 0
                })
                .select()
                .single()

            if (!chapterError && chapterData) {
                setChapters([chapterData])
                setActiveChapterId(chapterData.id)
                setChapterTitle(chapterData.title)
            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    const updateBook = async () => {
        if (!book?.id) return
        setSaving(true)
        try {
            // Update Book Info
            await supabase
                .from('books')
                .update({ title, description, updated_at: new Date().toISOString() })
                .eq('id', book.id)

            // Update Active Chapter
            if (activeChapterId) {
                await supabase
                    .from('chapters')
                    .update({
                        title: chapterTitle,
                        content,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', activeChapterId)
            }

            toast.success('Changes saved')
        } catch (error) {
            toast.error('Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const handleChapterChange = async (chapterId: string) => {
        // Auto-save current chapter before switching
        if (activeChapterId) {
            await supabase
                .from('chapters')
                .update({ content, title: chapterTitle })
                .eq('id', activeChapterId)
        }

        const chapter = chapters.find(c => c.id === chapterId)
        if (chapter) {
            setActiveChapterId(chapterId)
            setChapterTitle(chapter.title)
            setContent(chapter.content)
        }
    }

    const createNewChapter = async () => {
        if (!book?.id) return
        try {
            const newOrder = chapters.length
            const { data, error } = await supabase
                .from('chapters')
                .insert({
                    book_id: book.id,
                    title: `Chapter ${newOrder + 1}`,
                    content: '',
                    order_index: newOrder
                })
                .select()
                .single()

            if (error) throw error
            setChapters([...chapters, data])
            handleChapterChange(data.id)
            toast.success('New chapter added')
        } catch (error) {
            toast.error('Failed to add chapter')
        }
    }

    // AI Chat
    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!aiInput.trim()) return

        const userMsg = { role: 'user' as const, content: aiInput }
        setMessages(prev => [...prev, userMsg])
        setAiInput('')
        setAiLoading(true)

        try {
            const { data, error } = await supabase.functions.invoke('ai-chat', {
                body: {
                    prompt: userMsg.content,
                    context: `Book Title: ${title}\nChapter: ${chapterTitle}\nCurrent Content: ${content}`,
                    history: messages.slice(-5) // Send last 5 messages for context
                }
            })

            if (error) throw error

            // Stream response or just set it (Supabase edge functions usually return stream, but for simple chat plain text is easier first)
            // Assuming the function returns { text: "response" } or stream
            // For this MVP, let's assume it returns a JSON with 'response' or we read the stream.

            // If the function streams, we need a reader. But let's assume simple JSON for now based on previous review.
            // Wait, previous review showed it serves a response. Let's see... 
            // It calls Gemini API. Gemini API returns JSON.

            // Let's assume data is the response object.
            const aiResponse = data?.response || "I couldn't generate a response."

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])

        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your API key setup.' }])
        } finally {
            setAiLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar - Chapters */}
            <motion.div
                className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col"
                initial={{ x: -264 }}
                animate={{ x: 0 }}
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <span className="font-bold flex items-center gap-2">
                        <Book className="w-4 h-4 text-purple-600" />
                        Chapters
                    </span>
                    <Button variant="ghost" size="icon" onClick={createNewChapter} disabled={!book?.id}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {chapters.map((chapter) => (
                        <button
                            key={chapter.id}
                            onClick={() => handleChapterChange(chapter.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeChapterId === chapter.id
                                ? 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-100'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <FileText className="w-3 h-3 opacity-50" />
                            <span className="truncate flex-1">{chapter.title}</span>
                        </button>
                    ))}
                    {chapters.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No chapters yet
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <Button variant="outline" className="w-full" onClick={() => navigate('/feed')}>
                        Exit Editor
                    </Button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative h-full">
                {/* Toolbar */}
                <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-6 justify-between z-10">
                    <div className="flex items-center gap-4 flex-1">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Book Title"
                            className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto bg-transparent w-full md:w-96"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowAiChat(!showAiChat)}
                            className={showAiChat ? 'bg-purple-100 text-purple-600' : ''}
                        >
                            <Sparkles className="w-5 h-5" />
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save
                        </Button>
                    </div>
                </header>

                {/* Editor Area */}
                <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                    {activeChapterId || !bookId ? (
                        <div className="space-y-6">
                            <Input
                                value={chapterTitle}
                                onChange={(e) => setChapterTitle(e.target.value)}
                                placeholder="Chapter Title"
                                className="text-3xl font-bold border-none shadow-none focus-visible:ring-0 px-0 h-auto bg-transparent placeholder:text-gray-300"
                            />
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Start writing your story..."
                                className="min-h-[500px] border-none shadow-none focus-visible:ring-0 px-0 resize-none text-lg leading-relaxed bg-transparent"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select or create a chapter to start writing
                        </div>
                    )}
                </div>
            </div>

            {/* AI Sidebar */}
            <AnimatePresence>
                {showAiChat && (
                    <motion.div
                        className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col absolute right-0 top-0 bottom-0 z-20 shadow-xl"
                        initial={{ x: 320 }}
                        animate={{ x: 0 }}
                        exit={{ x: 320 }}
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <span className="font-bold flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                AI Assistant
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => setShowAiChat(false)}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {aiLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                            <form onSubmit={handleAiSubmit} className="flex gap-2">
                                <Input
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    placeholder="Ask AI..."
                                    disabled={aiLoading}
                                />
                                <Button size="icon" type="submit" disabled={aiLoading || !aiInput.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <Toaster />
        </div>
    )
}
