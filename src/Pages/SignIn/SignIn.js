import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './Signin.css'; // Import external styling

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      navigate('/dashboard');
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return alert("Enter your email to reset password.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent. Check your inbox.");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="signin-container">
      <div className="heading-container">
        <div className="hanging-nail"></div>
        <h2 className="hanging-heading">
          <span className="blue-letter">S</span>ign{" "}
          <span className="blue-letter">I</span>n
        </h2>
      </div>

      <div className="input-wrapper">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="button-wrapper">
    <button className="login-btnlogin" onClick={handleSignIn}>Login</button>
  </div>

      <div className="signin-links">
        <p className="forgot-password" onClick={handlePasswordReset}>Forgot Password?</p>
        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate('/')}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
