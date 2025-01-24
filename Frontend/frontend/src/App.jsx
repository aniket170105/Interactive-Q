import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import { Route } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import './App.css'
import HomePage from './Pages/HomePage'
import SignInPage from './Pages/SignInPage'
import SignUpPage from './Pages/SignUpPage'
import ChatPage from './Pages/ChatPage/ChatPage'

function App() {

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<ChatPage />} />
          <Route path="/contact" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  )
}
export default App
