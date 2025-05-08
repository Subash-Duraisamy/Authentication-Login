// signup.js or SignUp.js
import React, { useState } from 'react';
import { auth, db } from '../../firebase'; // import your Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
      navigate("/signin"); // redirect to login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <br />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <button onClick={handleSignUp}>Sign Up</button>
      <p>Already have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/signin')}>Sign In</span></p>
    </div>
  );
}
