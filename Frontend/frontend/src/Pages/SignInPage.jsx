import React from "react";
import { useState } from 'react'
import "./signinpage.css";

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

    const handleSubmit = async (e) => {
        setError(false);
        e.preventDefault();
        try {
            await signInUser(email, password);
            console.log("Handled the Log in");
        }
        catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.log(error.message);
        }
    }

    return (
        <div>
            <div className="container">
                <div className="form-wrapper">
                    <div className="header">
                        <h1>Log In</h1>
                    </div>

                    {error &&
                        <div id="error" className="error">
                            {errorMessage}
                        </div>
                    }

                    <form id="signin-form" className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); }}
                            />
                            <a href="/" className="forgot-password">Forgot password?</a>
                        </div>
                        <button type="submit" className="submit-btn">Continue</button>
                    </form>
                    <p className="signup-link">
                        Don't have an account? <a href="/SignUp">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default SignInPage;