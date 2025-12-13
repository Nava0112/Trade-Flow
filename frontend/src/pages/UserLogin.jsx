import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { login } from "../slices/authSlice.js";

const UserLogin = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0); // ✅ Track attempts
  const [isLocked, setIsLocked] = useState(false); // ✅ Track if locked out

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth, navigate]);

  // ✅ Reset attempts when email changes
  useEffect(() => {
    setAttempts(0);
    setIsLocked(false);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check if locked out
    if (isLocked) {
      alert("Too many failed attempts. Please create a new account or try again later.");
      return;
    }

    const data = { name, email, password };

    try {
      // 1️⃣ Try to fetch user by email
      const getUser = await api.get(`/users/${email}`);

      // ✅ User found — check password
      if (getUser.data && getUser.status === 200) {
        if (getUser.data.password === password) {
          // ✅ Correct password - login successful
          dispatch(login(getUser.data));
          setAttempts(0); // Reset attempts on success
          navigate("/");
        } else {
          // ❌ Wrong password
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          
          if (newAttempts >= 3) {
            setIsLocked(true);
            alert("❌ Too many failed attempts. Please create a new account.");
          } else {
            alert(`❌ Incorrect password! ${3 - newAttempts} attempts remaining.`);
          }
        }
      }
    } catch (error) {
      // 2️⃣ If user not found, create a new one
      if (error.response && error.response.status === 404) {
        try {
          const newUser = await api.post("/users", data);
          console.log("🆕 User created:", newUser.data);
          dispatch(login(newUser.data));
          navigate("/");
        } catch (createError) {
          console.error("❌ Error creating user:", createError);
          alert("Error creating user. Please try again.");
        }
      } else {
        console.error("❌ Error fetching user:", error);
        alert("Error logging in. Please try again.");
      }
    }
  };

  const handleCreateAccount = () => {
    setIsLocked(false);
    setAttempts(0);
    // The form will now submit and create account since user doesn't exist
  };

  const handleTryAgain = () => {
    setIsLocked(false);
    setAttempts(0);
    setPassword(""); // Clear password field
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />

        {/* ✅ Show different buttons based on state */}
        {isLocked ? (
          <div>
            <p>Too many failed attempts. What would you like to do?</p>
            <button type="button" onClick={handleCreateAccount}>
              Create New Account
            </button>
            <button type="button" onClick={handleTryAgain}>
              Try Again
            </button>
          </div>
        ) : (
          <button type="submit">
            {attempts > 0 ? `Try Again (${3 - attempts} left)` : "Login / Register"}
          </button>
        )}
      </form>

      {/* ✅ Show attempt counter */}
      {attempts > 0 && !isLocked && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Attempts: {attempts}/3
        </p>
      )}
    </div>
  );
};

export default UserLogin;