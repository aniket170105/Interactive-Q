import React from "react";
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const signInUser = async (email, password) => {
    const user = {
        "email": email,
        "password": password
    };
    console.log(JSON.stringify(user));
    const response = await fetch('http://localhost:8081/auth/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    // console.log(await response.json());
    if (response.ok) {
        const { refreshToken, sessionToken } = await response.json();
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("sessionToken", sessionToken);
        return true;
    }
    else {
        console.log("Throwing Error");
        throw new Error("Error While Logging In");
    }
}

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        document.title = "InteractiveQ - Log In";
        const token = localStorage.getItem('refreshToken');
        if (token) {
            navigate('/chat');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        setError(false);
        e.preventDefault();
        try {
            await signInUser(email, password);
            console.log("Handled the Log in");
            navigate('/chat');
        }
        catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.log(error.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md card p-6">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-semibold">Log In</h1>
                </div>

                {error && (
                    <div id="error" className="mb-4 text-sm rounded-md border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2">
                        {errorMessage}
                    </div>
                )}

                <form id="signin-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm text-neutral-300 mb-1">Email address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@example.com"
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); }}
                            className="input"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm text-neutral-300 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); }}
                            className="input"
                        />
                        <a href="/" className="inline-block mt-2 text-xs text-neutral-400 hover:text-white">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full btn">
                        Continue
                    </button>
                </form>

                <p className="mt-4 text-sm text-neutral-400">
                    Don't have an account? <Link to="/signup" className="underline hover:text-white">Sign Up</Link>
                </p>
            </div>
    </div>
    );

};

export default SignInPage;