import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Loader2, Sparkles, Zap } from 'lucide-react'
import ParticlesBackground from '@/components/effects/ParticlesBackground'
import toast, { Toaster } from 'react-hot-toast'

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
                const { error } = await signUp(email, password, username)
                if (error) throw error
                toast.success('✨ Account created! Welcome!', {
                    style: {
                        background: '#8b5cf6',
                        color: '#fff',
                    },
                })
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 animate-gradient-shift" />

            {/* Particles */}
            <ParticlesBackground />

            {/* Floating orbs */}
            <motion.div
                className="absolute top-20 left-20 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl"
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
                className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
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

            <div className="relative z-10 w-full max-w-md px-4">
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
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg mb-4 relative"
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
                        <Card className="glass border-white/30 shadow-2xl backdrop-blur-xl bg-white/10 overflow-hidden">
                            {/* Animated border gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-50 blur-xl animate-pulse" />

                            <div className="relative">
                                <CardHeader>
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <CardTitle className="text-3xl text-center text-white">
                                            {isLogin ? 'Welcome Back' : 'Create Account'}
                                        </CardTitle>
                                        <CardDescription className="text-center text-white/80">
                                            {isLogin ? 'Sign in to continue your journey' : 'Start your writing journey today'}
                                        </CardDescription>
                                    </motion.div>
                                </CardHeader>

                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {!isLogin && (
                                            <motion.div
                                                className="space-y-2"
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.35 }}
                                            >
                                                <label htmlFor="username" className="text-sm font-medium text-white">
                                                    Username
                                                </label>
                                                <Input
                                                    id="username"
                                                    type="text"
                                                    placeholder="johndoe"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required={!isLogin}
                                                    disabled={loading}
                                                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 transition-all"
                                                />
                                            </motion.div>
                                        )}

                                        <motion.div
                                            className="space-y-2"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label htmlFor="email" className="text-sm font-medium text-white">
                                                Email
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 transition-all"
                                            />
                                        </motion.div>

                                        <motion.div
                                            className="space-y-2"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <label htmlFor="password" className="text-sm font-medium text-white">
                                                Password
                                            </label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                                minLength={6}
                                                className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 transition-all"
                                            />
                                        </motion.div>

                                        {!isLogin && (
                                            <motion.div
                                                className="space-y-2"
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.55 }}
                                            >
                                                <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                                                    Confirm Password
                                                </label>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required={!isLogin}
                                                    disabled={loading}
                                                    minLength={6}
                                                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 transition-all"
                                                />
                                            </motion.div>
                                        )}

                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <Button
                                                type="submit"
                                                className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold text-lg py-6 relative overflow-hidden group"
                                                disabled={loading}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                                                    initial={{ x: '-100%' }}
                                                    whileHover={{ x: '100%' }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                            Please wait
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isLogin ? 'Sign In' : 'Sign Up'}
                                                            <Sparkles className="h-5 w-5" />
                                                        </>
                                                    )}
                                                </span>
                                            </Button>
                                        </motion.div>
                                    </form>

                                    <motion.div
                                        className="mt-6 text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setIsLogin(!isLogin)}
                                            className="text-sm text-white/90 hover:text-white transition-colors underline decoration-wavy decoration-pink-400 underline-offset-4"
                                            disabled={loading}
                                        >
                                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                                        </button>
                                    </motion.div>
                                </CardContent>
                            </div>
                        </Card>
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
                            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium"
                            whileHover={{ scale: 1.1, y: -5 }}
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                y: {
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                },
                            }}
                        >
                            {text}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <Toaster position="top-center" />
        </div>
    )
}
