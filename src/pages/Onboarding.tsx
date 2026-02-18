import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Camera, Sparkles, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function Onboarding() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [fullName, setFullName] = useState('')
    const [bio, setBio] = useState('')
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])

    const interests = [
        'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Thriller',
        'Horror', 'Historical', 'Biography', 'Self-Help', 'Poetry'
    ]

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(prev => prev.filter(i => i !== interest))
        } else {
            if (selectedInterests.length < 5) {
                setSelectedInterests(prev => [...prev, interest])
            } else {
                toast.error('You can select up to 5 interests')
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)

        try {
            let avatarUrl = null

            // Upload avatar if selected
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop()
                const fileName = `${user.id}/${Math.random()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName)

                avatarUrl = publicUrl
            }

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    user_id: user.id,
                    full_name: fullName,
                    bio: bio,
                    interests: selectedInterests,
                    avatar_url: avatarUrl,
                    username: user.user_metadata?.username || user.email?.split('@')[0],
                    updated_at: new Date().toISOString(),
                })

            if (updateError) throw updateError

            toast.success('Profile setup complete!', {
                icon: '🎉',
                style: {
                    background: '#8b5cf6',
                    color: '#fff',
                }
            })

            setTimeout(() => navigate('/feed'), 1000)

        } catch (error: any) {
            console.error('Error:', error)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 py-12 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-gradient-to-br from-violet-900 via-gray-900 to-indigo-900 z-0" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <Card className="glass border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                            <CardTitle className="text-3xl text-white font-bold">Welcome to BookCreator</CardTitle>
                            <CardDescription className="text-gray-400 text-lg">Let's set up your profile to get started</CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group cursor-pointer">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30 bg-gray-800 flex items-center justify-center relative">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="w-10 h-10 text-gray-500" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs text-white font-medium">Change</span>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <Label className="text-gray-300">Upload Profile Picture</Label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname" className="text-gray-300">Full Name</Label>
                                    <Input
                                        id="fullname"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="J.K. Rowling"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:bg-white/10 min-h-[40px]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-gray-300 block">Select Interests (max 5)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest) => (
                                        <motion.button
                                            key={interest}
                                            type="button"
                                            onClick={() => toggleInterest(interest)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${selectedInterests.includes(interest)
                                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {interest}
                                            {selectedInterests.includes(interest) && <Check className="w-3 h-3" />}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-6 text-lg relative overflow-hidden"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <Sparkles className="w-5 h-5 mr-2" />
                                )}
                                {loading ? 'Saving Profile...' : 'Complete Setup'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
            <Toaster />
        </div>
    )
}
