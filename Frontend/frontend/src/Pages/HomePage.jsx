import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { ThemeToggleButton } from '../theme/ThemeProvider.jsx'

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "InteractiveQ - Home";
        const token = localStorage.getItem('refreshToken');
        if (token) {
            navigate('/chat');
        }
    }, [navigate]);
    return (
        <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-black dark:text-white">
            <header className="border-b border-neutral-200 dark:border-neutral-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xl font-semibold">
                        <span className="text-2xl">💬</span>
                        <span>InteractiveQ</span>
                    </div>
                    <nav className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggleButton />
                        <button
                            className="px-3 sm:px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10 transition"
                            onClick={()=>{navigate('/signin')}}
                        >
                            Log In
                        </button>
                        <button
                            className="px-3 sm:px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition"
                            onClick={()=>{navigate('/signup')}}
                        >
                            Sign Up
                        </button>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">Engage Your Audience in Real-Time</h1>
                        <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
                            Create interactive Q&A sessions, live polls, and more with InteractiveQ. Perfect for meetings, events, and classrooms.
                        </p>
                        <div className="mt-8">
                            <button
                                className="px-5 sm:px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold hover:opacity-90 transition"
                                onClick={()=>{navigate('/signup')}}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-neutral-200 dark:border-neutral-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    <p>© 2024 InteractiveQ. All rights reserved.</p>
                    <nav className="flex items-center gap-3">
                        <a href="#" className="hover:text-black dark:hover:text-white transition">Terms of Service</a>
                        <a href="#" className="hover:text-black dark:hover:text-white transition">Privacy</a>
                    </nav>
                </div>
            </footer>
        </div>
    )
}

export default HomePage;