import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Loader2, Sparkles, Zap } from 'lucide-react'
import ParticlesBackground from '@/components/effects/ParticlesBackground'
import toast from 'react-hot-toast'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    // 3D Card tilt effect
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY

        api.start({
            x: (mouseY / rect.height) * 20,
            y: (mouseX / rect.width) * -20,
        })
    }

    const handleMouseLeave = () => {
        api.start({ x: 0, y: 0 })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                const { error } = await signIn(email, password)
                if (error) throw error
                toast.success('🎉 Welcome back!', {
                    style: {
                        background: '#8b5cf6',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#8b5cf6',
                    },
                })
                setTimeout(() => navigate('/feed'), 500)
            } else {
                if (password !== confirmPassword) {
                    throw new Error("Passwords don't match")
                }
                const { data, error } = await signUp(email, password, username)
                if (error) throw error

                // Check if email confirmation is required (user exists but no session)
                if (data?.user && !data?.session) {
                    toast.success('📧 Check your email to confirm account!', {
                        duration: 5000,
                        icon: '📩'
                    })
                    setIsLogin(true) // Switch to login view
                    return
                }

                toast.success('✨ Account created! Welcome!')
                setTimeout(() => navigate('/onboarding'), 500)
            }
        } catch (err: unknown) {
            toast.error((err as Error).message || 'An error occurred', {
                style: {
                    background: '#ef4444',
                    color: '#fff',
                },
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-x-hidden bg-gray-900">
            {/* Animated gradient background - Fixed to cover scrollable areas */}
            <div className="fixed inset-0 bg-gradient-to-br from-violet-600 via-purple-900 to-indigo-900 animate-gradient-shift z-0" />

            {/* Particles - reduced density to prevent crashes */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ParticlesBackground />
            </div>

            {/* Floating orbs */}
            <motion.div
                className="fixed top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl z-0"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="fixed bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl z-0"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div className="relative z-10 w-full max-w-md px-4 py-8">
                {/* Logo with advanced animation */}
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                    }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-lg mb-4 relative"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                    >
                        <BookOpen className="w-10 h-10 text-white" />
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(139, 92, 246, 0.5)',
                                    '0 0 60px rgba(139, 92, 246, 0.8)',
                                    '0 0 20px rgba(139, 92, 246, 0.5)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>

                    <motion.h1
                        className="text-5xl font-bold text-white mb-2"
                        animate={{
                            textShadow: [
                                '0 0 20px rgba(255,255,255,0.5)',
                                '0 0 40px rgba(255,255,255,0.8)',
                                '0 0 20px rgba(255,255,255,0.5)',
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        BookCreator
                    </motion.h1>

                    <motion.p
                        className="text-white/90 flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Sparkles className="w-4 h-4" />
                        Write, publish, and share your stories
                        <Zap className="w-4 h-4" />
                    </motion.p>
                </motion.div>

                {/* 3D Card with tilt effect */}
                <animated.div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: x.to((x) => `perspective(1000px) rotateX(${x}deg) rotateY(${y.get()}deg)`),
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                    >
                        <div className="relative z-10 w-full max-w-md">
                            <AnimatePresence mode="wait">
                                {isLogin ? (
                                    <motion.div
                                        key="login"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 shadow-2xl border-purple-200 dark:border-purple-800">
                                            <CardHeader>
                                                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                                    Welcome Back
                                                </CardTitle>
                                                <CardDescription className="text-center">
                                                    Sign in to continue your journey
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Email</div>
                                                        <Input
                                                            type="email"
                                                            placeholder="hello@example.com"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            className="bg-white/50 dark:bg-gray-800/50"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Password</div>
                                                        <Input
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            className="bg-white/50 dark:bg-gray-800/50"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30"
                                                        disabled={loading}
                                                    >
                                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                                                    </Button>
                                                </form>

                                                <div className="mt-6 flex flex-col items-center gap-4">
                                                    <button
                                                        onClick={() => setIsLogin(false)}
                                                        className="text-sm text-purple-600 hover:underline"
                                                    >
                                                        Don't have an account? Sign up
                                                    </button>
                                                    <button
                                                        onClick={() => navigate('/feed')}
                                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                                    >
                                                        Browse as Guest
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="signup"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 shadow-2xl border-purple-200 dark:border-purple-800">
                                            <CardHeader>
                                                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                                    Create Account
                                                </CardTitle>
                                                <CardDescription className="text-center">
                                                    Join our community of writers
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Username</div>
                                                        <Input
                                                            type="text"
                                                            placeholder="johndoe"
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                            required
                                                            className="bg-white/50 dark:bg-gray-800/50"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Email</div>
                                                        <Input
                                                            type="email"
                                                            placeholder="hello@example.com"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            className="bg-white/50 dark:bg-gray-800/50"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Password</div>
                                                        <Input
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            className="bg-white/50 dark:bg-gray-800/50"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">Confirm Password</div>
                                                        <Input
                                                            type="password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            required
                                                            className="bg-white/50 dark:bg-gray-800/50"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30"
                                                        disabled={loading}
                                                    >
                                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign Up'}
                                                    </Button>
                                                </form>

                                                <div className="mt-6 flex flex-col items-center gap-4">
                                                    <button
                                                        onClick={() => setIsLogin(true)}
                                                        className="text-sm text-purple-600 hover:underline"
                                                    >
                                                        Already have an account? Sign in
                                                    </button>
                                                    <button
                                                        onClick={() => navigate('/feed')}
                                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                                    >
                                                        Browse as Guest
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </animated.div>

                {/* Floating badges */}
                <motion.div
                    className="flex justify-center gap-4 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    {['AI Powered', 'Free Forever', 'No Limits'].map((text, i) => (
                        <motion.div
                            key={text}
                            className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80 text-xs font-medium"
                            whileHover={{ scale: 1.1, y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                y: {
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: 'easeInOut',
                                },
                            }}
                        >
                            {text}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

        </div>
    )
}
