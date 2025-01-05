import React from 'react';
import './homepage.css';

const HomePage = () => {
    return (
        <div class="container">
            <header class="header">
                <div class="logo">
                    <span class="icon">💬</span>
                    <span>InteractiveQ</span>
                </div>
                <nav class="nav">
                    <a href="/SignIn" class="btn ghost">Log in</a>
                    <a href="/SignUp" class="btn">Sign up</a>
                </nav>
            </header>

            <main>
                <section class="hero">
                    <div class="hero-content">
                        <h1>Engage Your Audience in Real-Time</h1>
                        <p>
                            Create interactive Q&A sessions, live polls, and more with InteractiveQ. Perfect for meetings, events, and classrooms.
                        </p>
                        <button class="btn primary">Get Started</button>
                    </div>
                </section>
            </main>

            <footer class="footer">
                <p>© 2024 InteractiveQ. All rights reserved.</p>
                <nav>
                    <a href="#">Terms of Service</a>
                    <a href="#">Privacy</a>
                </nav>
            </footer>
        </div>
    )
}

export default HomePage;