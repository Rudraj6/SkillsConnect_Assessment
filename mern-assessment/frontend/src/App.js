import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Contacts from "./pages/Contacts";

import { getToken, autoLogout } from "./authService";

// NEW: Home screen component (inline to avoid extra file)
function Home({ onSelect }) {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          color: "#1e293b",
          marginBottom: "10px",
        }}
      >
        Welcome to SkillsConnect CRM
      </h1>

      <p style={{ color: "#475569", marginBottom: "25px", fontSize: "14px" }}>
        A simple & powerful CRM system for managing contacts and tasks.
      </p>

      <div style={{ display: "flex", gap: "20px" }}>
        <button
          onClick={() => onSelect("login")}
          style={{
            padding: "12px 20px",
            background: "#0284c7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            transition: "0.2s",
          }}
        >
          Login
        </button>

        <button
          onClick={() => onSelect("register")}
          style={{
            padding: "12px 20px",
            background: "#64748b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            transition: "0.2s",
          }}
        >
          Register
        </button>
      </div>

      <footer
        style={{
          marginTop: "40px",
          fontSize: "13px",
          color: "#94a3b8",
        }}
      >
        Developed by <strong>Rudra Jha</strong>
      </footer>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(getToken()));
  const [screen, setScreen] = useState("home"); // NEW: controls home/login/register screens

  useEffect(() => {
    const token = getToken();
    if (token) autoLogout(token);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          background: "#f4f6f9",
          margin: 0,
          padding: 0,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            background: "#1e293b",
            padding: "15px 25px",
            color: "white",
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: "bold",
            letterSpacing: "1px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          SkillsConnect CRM Assessment
        </header>

        <main
          style={{
            maxWidth: "800px",
            margin: "40px auto",
            padding: "20px",
          }}
        >
          <Routes>
            {/* PUBLIC ROUTE — HOME + LOGIN + REGISTER */}
            <Route
              path="/"
              element={
                !loggedIn ? (
                  <>
                    {screen === "home" && (
                      <Home onSelect={(s) => setScreen(s)} />
                    )}

                    {screen === "login" && (
                      <div
                        style={{
                          background: "white",
                          padding: "25px",
                          borderRadius: "12px",
                          boxShadow: "0 0 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        <button
                          onClick={() => setScreen("home")}
                          style={{
                            marginBottom: "10px",
                            padding: "6px 10px",
                            background: "#cbd5e1",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          ← Back
                        </button>

                        <Login onLogin={() => setLoggedIn(true)} />
                      </div>
                    )}

                    {screen === "register" && (
                      <div
                        style={{
                          background: "white",
                          padding: "25px",
                          borderRadius: "12px",
                          boxShadow: "0 0 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        <button
                          onClick={() => setScreen("home")}
                          style={{
                            marginBottom: "10px",
                            padding: "6px 10px",
                            background: "#cbd5e1",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          ← Back
                        </button>

                        <Register />
                      </div>
                    )}
                  </>
                ) : (
                  <Navigate to="/contacts" replace />
                )
              }
            />

            {/* PROTECTED ROUTE — CONTACTS */}
            <Route
              path="/contacts"
              element={
                loggedIn ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "25px",
                        padding: "10px 15px",
                        background: "white",
                        borderRadius: "12px",
                        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <h2 style={{ margin: 0, color: "#1e293b" }}>Dashboard</h2>

                      <button
                        onClick={logout}
                        style={{
                          background: "#ef4444",
                          border: "none",
                          padding: "8px 15px",
                          color: "white",
                          fontSize: "14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Logout
                      </button>
                    </div>

                    <div
                      style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Contacts />
                    </div>
                  </>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
