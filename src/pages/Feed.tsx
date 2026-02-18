import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react'
import { useSpring, animated } from '@react-spring/web'


export default function Feed() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 relative overflow-hidden">
            {/* Animated background orbs */}
            <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -100, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Header with animations */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            <Sparkles className="w-8 h-8 text-purple-600" />
                        </motion.div>
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                            Discover Books
                        </h1>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                        </motion.div>
                    </motion.div>

                    <motion.p
                        className="text-xl text-muted-foreground flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <TrendingUp className="w-5 h-5" />
                        Explore amazing stories from talented authors
                    </motion.p>

                    {/* Stats badges */}
                    <motion.div
                        className="flex justify-center gap-4 mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {[
                            { label: '1000+ Books', icon: BookOpen },
                            { label: 'AI Powered', icon: Sparkles },
                            { label: 'Free to Read', icon: TrendingUp },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="px-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-purple-200 dark:border-purple-800"
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
                                <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
                                    <stat.icon className="w-4 h-4" />
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Book grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <BookCardSkeleton key={i} index={i} />
                    ))}
                </div>

                {/* Info message */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <motion.div
                        className="inline-block p-8 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-2xl border border-purple-200 dark:border-purple-800"
                        whileHover={{ scale: 1.05 }}
                        animate={{
                            boxShadow: [
                                '0 0 20px rgba(139, 92, 246, 0.3)',
                                '0 0 60px rgba(139, 92, 246, 0.5)',
                                '0 0 20px rgba(139, 92, 246, 0.3)',
                            ],
                        }}
                        transition={{
                            boxShadow: { duration: 2, repeat: Infinity },
                        }}
                    >
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600 animate-pulse" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Configure your Supabase credentials to see published books
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Check the <code className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded">DEPLOYMENT.md</code> file for setup instructions
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

// Enhanced Book Card Skeleton with 3D effect
function BookCardSkeleton({ index }: { index: number }) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY

        api.start({
            x: (mouseY / rect.height) * -15,
            y: (mouseX / rect.width) * 15,
        })
    }

    const handleMouseLeave = () => {
        api.start({ x: 0, y: 0 })
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
        >
            <animated.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: x.to((x) => `perspective(1000px) rotateX(${x}deg) rotateY(${y.get()}deg)`),
                }}
            >
                <Card className="overflow-hidden hover-lift cursor-pointer group relative">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/20 group-hover:to-indigo-500/20 transition-all duration-500 z-10" />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

                    <Skeleton className="h-80 w-full relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-400"
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.1,
                            }}
                        />
                    </Skeleton>

                    <CardContent className="p-4 relative z-10">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />

                        {/* Floating badge */}
                        <motion.div
                            className="absolute top-2 right-2 px-3 py-1 rounded-full bg-purple-500/80 backdrop-blur-sm text-white text-xs font-semibold"
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.15,
                            }}
                        >
                            New
                        </motion.div>
                    </CardContent>
                </Card>
            </animated.div>
        </motion.div>
    )
}
