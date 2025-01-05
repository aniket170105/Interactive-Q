import React from "react";

import "./signuppage.css";

const SignUpPage = () => {
    return (
        <div className="signuppage">
            <div className="container">
                <div className="text-center">
                    <h1 className="title">Create an Account</h1>
                </div>
                {/* Uncomment the below block if you want to display errors */}
                {/* 
                <div id="error" className="error" style={{ display: "none" }}>
                    Error message goes here.
                </div> 
                */}
                <form>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                        />
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="terms" name="terms" required />
                        <label htmlFor="terms">
                            I agree to the{" "}
                            <a href="/terms" className="link">Terms of Service</a> and{" "}
                            <a href="/privacy" className="link">Privacy Policy</a>.
                        </label>
                    </div>
                    <button type="submit" className="btn">
                        Create Account
                    </button>
                </form>
                <p className="text-muted">
                    Already have an account?{" "}
                    <a href="/SignIn" className="link">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
