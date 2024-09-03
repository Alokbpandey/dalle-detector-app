import React, { useState } from "react";
import './SignInSignUp.css';

function SignIn({ onToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    // Logic for sign-in
    console.log("Signed in with:", { email, password });
  };

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter institutional email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Sign In
        </button>
      </form>
      <p className="toggle-text">
        Don't have an account? <span onClick={onToggle}>Sign Up</span>
      </p>
    </div>
  );
}

export default SignIn;
