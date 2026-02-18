import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Camera, Save, User, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [fullName, setFullName] = useState('')
    const [bio, setBio] = useState('')
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])

    const interestsList = [
        'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Thriller',
        'Horror', 'Historical', 'Biography', 'Self-Help', 'Poetry'
    ]

    useEffect(() => {
        if (user) loadProfile()
    }, [user])

    const loadProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user!.id)
                .single()

            if (error) throw error

            if (data) {
                setFullName(data.full_name || '')
                setBio(data.bio || '')
                setAvatarUrl(data.avatar_url)
                if (data.avatar_url) setAvatarPreview(data.avatar_url)
                setSelectedInterests(data.interests || [])
            }
        } catch (error) {
            console.error('Error loading profile:', error)
        } finally {
            setFetching(false)
        }
    }

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
            let newAvatarUrl = avatarUrl

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

                newAvatarUrl = publicUrl
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    bio: bio,
                    interests: selectedInterests,
                    avatar_url: newAvatarUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)

            if (updateError) throw updateError

            toast.success('Profile updated!')
            setTimeout(() => navigate('/feed'), 1000)

        } catch (error: any) {
            console.error('Error:', error)
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => navigate('/feed')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Feed
                </Button>

                <Card className="shadow-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <User className="w-6 h-6 text-purple-600" />
                            Edit Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group cursor-pointer">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100 dark:border-purple-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-gray-400" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <Label>Profile Picture</Label>
                            </div>

                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input
                                        id="fullname"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="block">Interests</Label>
                                <div className="flex flex-wrap gap-2">
                                    {interestsList.map((interest) => (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${selectedInterests.includes(interest)
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {interest}
                                            {selectedInterests.includes(interest) && <Check className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
