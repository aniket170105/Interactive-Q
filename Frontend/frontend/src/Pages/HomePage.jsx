import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import './homepage.css';
import { use } from 'react';

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
        <div class="homepage-container" >
            <header class="header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,
                padding: '1rem 2rem', borderBottom: '1px solid #444', background:"black", color:"white"
            }} >
                <div class="logo">
                    <span class="icon">💬</span>
                    <span>InteractiveQ</span>
                </div>
                <nav class="nav">
                    <a class="btn ghost" style={{padding:"10px", borderRadius:"4px" ,
                        textDecoration:"none", color:"white", background:"transparent", textAlign:"center", fontSize:"1rem",
                        border: "1px solid white"
                    }} onClick={()=>{navigate('/signin')}}>Log In</a>
                    <a href="/SignUp" class="btn" style={{padding:"10px", borderRadius:"4px" ,
                        textDecoration:"none", color:"white", background:"transparent", textAlign:"center", fontSize:"1rem",
                        border: "1px solid white"
                    }} onClick={()=>{navigate('/signup')}}>Signup</a>
                </nav>
            </header>

            <main>
                <section class="hero">
                    <div class="hero-content">
                        <h1>Engage Your Audience in Real-Time</h1>
                        <p>
                            Create interactive Q&A sessions, live polls, and more with InteractiveQ. Perfect for meetings, events, and classrooms.
                        </p>
                        <button class="btn primary" onClick={()=>{navigate('/signup')}}>Get Started</button>
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