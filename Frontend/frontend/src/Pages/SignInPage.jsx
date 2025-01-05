import React from "react";
import "./signinpage.css";

const SignInPage = () => {
    return (
        <body>
            <div class="container">
                <div class="form-wrapper">
                    <div class="header">
                        <h1>Log In</h1>
                    </div>
                    <form id="signin-form" class="form">
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" id="email" placeholder="name@example.com" required/>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" required/>
                            <a href="/" class="forgot-password">Forgot password?</a>
                        </div>
                        <button type="submit" class="submit-btn">Continue</button>
                    </form>
                    <p class="signup-link">
                        Don't have an account? <a href="/SignUp">Sign Up</a>
                    </p>
                </div>
            </div>
        </body>
    );
};

export default SignInPage;