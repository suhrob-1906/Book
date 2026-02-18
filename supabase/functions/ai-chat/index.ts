import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { prompt, bookId, chapterId, context } = await req.json()

        if (!prompt) {
            return new Response(
                JSON.stringify({ error: 'Prompt is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get Gemini API key from environment
        const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
        if (!geminiApiKey) {
            return new Response(
                JSON.stringify({ error: 'Gemini API key not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Optional: Fetch book/chapter context from Supabase
        let contextText = context || ''
        if (bookId || chapterId) {
            const supabaseClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_ANON_KEY') ?? ''
            )

            if (chapterId) {
                const { data: chapter } = await supabaseClient
                    .from('chapters')
                    .select('title, content')
                    .eq('id', chapterId)
                    .single()

                if (chapter) {
                    contextText = `Chapter: ${chapter.title}\n\nContent:\n${chapter.content}\n\n`
                }
            } else if (bookId) {
                const { data: book } = await supabaseClient
                    .from('books')
                    .select('title, description, genre')
                    .eq('id', bookId)
                    .single()

                if (book) {
                    contextText = `Book: ${book.title}\nGenre: ${book.genre}\nDescription: ${book.description}\n\n`
                }
            }
        }

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are a helpful writing assistant for authors. ${contextText ? `Context:\n${contextText}\n\n` : ''}User request: ${prompt}`,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                }),
            }
        )

        if (!geminiResponse.ok) {
            const error = await geminiResponse.text()
            console.error('Gemini API error:', error)
            return new Response(
                JSON.stringify({ error: 'Failed to generate response' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const data = await geminiResponse.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'

        return new Response(
            JSON.stringify({ response: text }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
