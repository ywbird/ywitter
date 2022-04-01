import { fAuth } from "fbase";
import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        await fAuth.createUserWithEmailAndPassword(
          fAuth.getAuth(),
          email,
          password
        );
      } else {
        await fAuth.signInWithEmailAndPassword(
          fAuth.getAuth(),
          email,
          password
        );
      }
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
  };
  const toggleNewAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new fAuth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new fAuth.GithubAuthProvider();
    }
    await fAuth.signInWithPopup(fAuth.getAuth(), provider);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {error}
        <div onClick={toggleNewAccount}>
          {!newAccount ? "Create Account" : "Log In"}
        </div>
      </form>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
