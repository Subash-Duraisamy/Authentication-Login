import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // import your CSS file

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        streakCount: 0,
        totalWeeks: 0,
        lastUpdated: Timestamp.now(),
      });

      alert("Signup successful!");
      navigate("/signin");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-heading">

      {/* <span>T</span> */}
          <span>S</span>
          <span>i</span>
          <span className="blue-letter">g</span>
          <span className="blue-letter">n</span>
          <span> </span>
          <span>U</span>
          {/* <span>i</span>
          <span className="blue-letter">s</span> */}
          <span className="blue-letter">p</span>
      
      </h2>
      <input
        type="text"
        className="signup-input"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="email"
        className="signup-input"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="signup-input"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="signup-button" onClick={handleSignUp}>
        Sign Up
      </button>
      <p className="signup-redirect">
        Already have an account?{" "}
        <span onClick={() => navigate('/signin')}>Sign In</span>
      </p>
    </div>
  );
}
