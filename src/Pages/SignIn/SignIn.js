// SignIn.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom'; // if using React Router

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      // Redirect to dashboard or home
      navigate('/dashboard');
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return alert("Enter your email to reset password.");
    try {
      await auth.sendPasswordResetEmail(email);
      alert("Reset email sent. Check your inbox.");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleSignIn}>Login</button>
      <p style={{ cursor: 'pointer', color: 'blue' }} onClick={handlePasswordReset}>
        Forgot Password?
      </p>
      <p>
        Don't have an account?{" "}
        <span
          onClick={() => navigate('/signup')}
          style={{ color: 'blue', cursor: 'pointer' }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}
