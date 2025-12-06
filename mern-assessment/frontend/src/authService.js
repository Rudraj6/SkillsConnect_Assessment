import api from "./api";
import { jwtDecode } from "jwt-decode";

let logoutTimer = null;

/* -------------------------------
   Save / Get / Remove Token
-------------------------------- */
export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
  if (logoutTimer) clearTimeout(logoutTimer);
}


/* -------------------------------
   Login Function
-------------------------------- */
export async function login(email, password) {
  const res = await api.post("/api/auth/login", { email, password });

  const token = res.data.token;
  saveToken(token);

  autoLogout(token);

  return jwtDecode(token); // return user details
}


/* -------------------------------
   Manual Logout
-------------------------------- */
export function logout() {
  removeToken();
  window.location.href = "/"; // redirect to login or home
}


/* -------------------------------
   Auto Logout (Token Expiry)
-------------------------------- */
export function autoLogout(token) {
  try {
    const decoded = jwtDecode(token);
    const expMs = decoded.exp * 1000; // convert seconds → ms
    const timeout = expMs - Date.now();

    if (logoutTimer) clearTimeout(logoutTimer);

    console.log("⏳ Auto Logout Timer (ms):", timeout);

    if (timeout > 0) {
      logoutTimer = setTimeout(() => {
        removeToken();
        alert("Session expired. Please log in again.");
        window.location.reload();
      }, timeout);
    } else {
      // token already expired
      removeToken();
    }
  } catch (err) {
    console.error("AutoLogout Error:", err);
  }
}


/* -------------------------------
   Check User From Token
-------------------------------- */
export function getUser() {
  try {
    const token = getToken();
    if (!token) return null;
    return jwtDecode(token);
  } catch {
    return null;
  }
}
