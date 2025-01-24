import React from "react";
import { useState } from 'react'


import "./signuppage.css";
import { redirect } from "react-router-dom";

const signUpUser = async (name, email, password) => {
    const user = {
        "name" : name,
        "email" : email,
        "password" : password
    };
    console.log(JSON.stringify(user));
    const response = await fetch('http://localhost:8081/auth/v1/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    console.log(await response.text());
    return response;
};

const SignUpPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        try{
            const response = await signUpUser(fullName, email, password);
            if(response.ok){
                console.log("Account created succesfully");
                // redirect("/Sign")
            }
            else{
                setError(true);
                setErrorMessage(await response.text());
            }
        }
        catch(error){
            setError(true);
            setErrorMessage("Error occured while creating your account");
        }
    };

    return (
        <div className="signuppage">
            <div className="container">
                <div className="text-center">
                    <h1 className="title">Create an Account</h1>
                </div>
                
                {error &&             
                    <div id="error" className="error">
                        {errorMessage}
                    </div>
                }
               
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="John Doe"
                            value = {fullName}
                            onChange= {(e) => {setFullName(e.target.value)}}
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
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}
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
